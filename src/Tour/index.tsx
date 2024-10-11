import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Popover } from 'antd';
import { Mask } from './Mask'
import { TooltipPlacement } from 'antd/es/tooltip';
import './index.scss';

export interface TourStepConfig {
  selector: () => HTMLElement | null;

  placement?: TooltipPlacement;

  renderContent?: (currentStep: number) => React.ReactNode;

  beforeForward?: (currentStep: number) => void;

  beforeBack?: (currentStep: number) => void;
}


export interface TourProps {
  step?: number;

  steps: TourStepConfig[];

  getContainer?: () => HTMLElement;

  onStepsEnd?: () => void;
}

export const Tour: FC<TourProps> = (props) => {
  const {
    step = 0,
    steps,
    onStepsEnd,
    getContainer
  } = props;

  const [currentStep, setCurrentStep] = useState<number>(0);

  const currentSelectedElement = steps[currentStep]?.selector();

  const currentContainerElement = getContainer?.() || document.documentElement;

  const [done, setDone] = useState(false);

  const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);

  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const back = async () => {
    if (currentStep === 0) {
      return;
    }

    const { beforeBack } = getCurrentStep();
    await beforeBack?.(currentStep);
    setCurrentStep(currentStep - 1);
  };

  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await onStepsEnd?.();
      setDone(true);
      return;
    }

    const { beforeForward } = getCurrentStep();
    await beforeForward?.(currentStep);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    setCurrentStep(step!);
  }, [step]);

  const renderPopover = (wrapper: React.ReactNode) => {
    const config = getCurrentStep();
    if (!config) {
      return wrapper;
    }

    const { renderContent } = config;
    const content = renderContent ? renderContent(currentStep) : null;

    const operation = (
      <div className={'tour-operation'}>
        {
          currentStep !== 0 &&
          <Button
            className={'back'}
            onClick={() => back()}>
            {'上一步'}
          </Button>
        }
        <Button
          className={'forward'}
          type={'primary'}
          onClick={() => forward()}>
          {currentStep === steps.length - 1 ? '我知道了' : '下一步'}
        </Button>
      </div>
    );

    return (
      isMaskMoving ? wrapper : <Popover
        content={<div>
          {content}
          {operation}
        </div>}
        open={true}
        placement={getCurrentStep()?.placement}>
        {wrapper}
      </Popover>
    );
  };

  // 这里的目的是在 dom 渲染完之后，触发重新渲染，从而渲染这个 Tour 组件
  // 因为我们需要获取到当前选中元素的位置，所以需要在 dom 渲染完之后，再获取到这个元素的位置
  const [, setRenderTick] = useState<number>(0);

  useEffect(() => {
    setRenderTick(1)
  }, []);

  // 第一次渲染的时候，元素是 null，触发重新渲染之后，就会渲染下面的 Mask 了
  if (!currentSelectedElement || done) {
    return null;
  }

  const mask = <Mask
    onAnimationStart={() => {
      setIsMaskMoving(true);
    }}
    onAnimationEnd={() => {
      setIsMaskMoving(false);
    }}
    container={currentContainerElement}
    element={currentSelectedElement}
    renderMaskContent={(wrapper) => renderPopover(wrapper)}
  />;

  return createPortal(mask, currentContainerElement);
}
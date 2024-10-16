import { Button, Flex } from 'antd'
import { Tour } from "./Tour"

function App() {
  return <div className='App'>
    <Flex gap="small" wrap="wrap" id="btn-group1">
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </Flex>

    <div style={{ height: '1000px' }}></div>

    <Flex wrap="wrap" gap="small">
      <Button type="primary" danger>
        Primary
      </Button>
      <Button danger>Default</Button>
      <Button type="dashed" danger id="btn-group2">
        Dashed
      </Button>
      <Button type="text" danger>
        Text
      </Button>
      <Button type="link" danger>
        Link
      </Button>
    </Flex>

    <div style={{ height: '500px' }}></div>

    <Flex wrap="wrap" gap="small">
      <Button type="primary" ghost>
        Primary
      </Button>
      <Button ghost>Default</Button>
      <Button type="dashed" ghost>
        Dashed
      </Button>
      <Button type="primary" danger ghost id="btn-group3">
        Danger
      </Button>
    </Flex>

    <Tour
      steps={
        [
          {
            selector: () => {
              return document.getElementById('btn-group1');
            },
            renderContent: () => {
              return "oi 小鬼";
            },
            placement: 'bottom'
          },
          {
            selector: () => {
              return document.getElementById('btn-group2');
            },
            renderContent: () => {
              return "感觉有点火热了呢";
            },
            placement: 'bottom'
          },
          {
            selector: () => {
              return document.getElementById('btn-group3');
            },
            renderContent: () => {
              return "是时候要冷静下来了";
            },
            placement: 'bottom'
          }
        ]
      } />
  </div>
}

export default App

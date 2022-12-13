import { useState } from 'react'
import './App.css'
import { Button, Carousel, Col, Input, Row, Space, Typography } from 'antd'

const IMAGES = [
  'https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/0.jpg',
  'https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/1.jpg',
  'https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/2.jpg',
  'https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/3.jpg',
  'https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/4.jpg',
]

const TEXT = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'

const PostPreview = ({ images, text }: { images: string[]; text: string; }) => {
  return (<div style={{ marginTop: '32px' }}>
    <Carousel className="images">
      {images.map((image, index) => (
        <img src={image} key={index} />
      ))}
    </Carousel>
    <Typography.Paragraph>{text}</Typography.Paragraph>
  </div>)
}

const App = () => {
  const [apiKey, setApiKey] = useState<string>()
  const [userQuery, setUserQuery] = useState<string>()
  const [result, setResult] = useState<{ images: string[]; text: string; }>()

  const onGenerate = async () => {
    // TODO: actually query openai
    setResult({ images: IMAGES, text: TEXT })
  }

  return (
    <Row justify="center" align="middle" >
      <Col>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <Typography.Title level={1}>GPT Insta Post Generator</Typography.Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Your OpenAI api key" />
            <Input.TextArea value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
            <Button onClick={onGenerate}>Generate</Button>
          </Space>
            {result ? <PostPreview {...result} /> : <div><Typography.Text strong>Make a query to see a post</Typography.Text></div>}
        </div>
      </Col>
    </Row>
  )
}

export default App

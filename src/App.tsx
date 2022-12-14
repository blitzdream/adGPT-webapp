import { useState, useEffect } from 'react'
import './App.css'
import { Button, Carousel, Col, Input, Row, Space, Typography, message, Alert } from 'antd'
import { Configuration, OpenAIApi } from "openai";

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
  const endpoint = "https://chat.openai.com/backend-api/moderations"
  const [orgaId, setOrgaId] = useState<string>()
  const [modelsResponse, setModelsResponse] = useState<string>()
  const [promptResponse, setPromptResponse] = useState<string>()
  const model = "text-moderation-playground"
  const content_type = "text/event-stream; charset=utf-8"
  const [generateError, setGenerateError] = useState<string>();

  const [openai, setOpenai] = useState<OpenAIApi>()

  useEffect(() => {
    if (apiKey == null || orgaId == null) return
    const configuration = new Configuration({
      organization: orgaId,
      apiKey,
    })
    setOpenai(new OpenAIApi(configuration))
  }, [apiKey])

  useEffect(() => {
    if (openai == null) return
    (async () => {
      const res = await openai.listEngines()
      setModelsResponse(JSON.stringify(res, undefined, 2))
    })()
  }, [openai])

  const onGenerate = async () => {
    // https://beta.openai.com/docs/api-reference/completions/create?lang=node.js
    if (openai == null || userQuery == null) {
      message.error('You need to set an api key before generating.')
      return
    }
    try {
      console.log('Querying ' + userQuery)
      const responseText = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: userQuery,
        max_tokens: 150,
        temperature: 0,
      })
      const responseImage = await openai.createImage({
        prompt: userQuery,
        n: 3,
        size: "1024x1024",
      });
      setResult({
        images: responseImage.data.data.map((d) => d.url).filter((x) => x !== undefined) as string[],
        text: responseText.data.choices[0].text ?? ""
      })
    } catch (e: any) {
      setGenerateError(JSON.stringify(e))
    }

  }

  return (
    <Row justify="center" align="middle" >
      <Col>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {generateError && <Alert message={generateError} />}
          <Typography.Title level={1}>GPT Insta Post Generator</Typography.Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Input value={orgaId} onChange={(e) => setOrgaId(e.target.value)} placeholder="Your OpenAI api key" />
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

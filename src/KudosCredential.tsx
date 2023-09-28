import * as React from "react";
import { UniqueVerifiableCredential } from "@veramo/core";
import { Avatar, Row, Col, Typography, theme, Space} from 'antd'

export const KudosCredential: React.FC<{credential: UniqueVerifiableCredential}> = ({ credential: { verifiableCredential } }) => {
  const { token } = theme.useToken()
  return <div>
    <Row style={{marginTop: token.margin}}>
      <Col>
        <Typography.Text strong>🏆 Kudos to {verifiableCredential.credentialSubject.avatar && <Avatar src={verifiableCredential.credentialSubject.avatar} shape="circle" size={'small'}/> } {verifiableCredential.credentialSubject.name}</Typography.Text>
        <Typography.Paragraph>{verifiableCredential.credentialSubject.kudos}</Typography.Paragraph>
      </Col>
    </Row>
    <Row>
      <Typography.Text type="secondary">
        <Space direction="horizontal">
          {verifiableCredential.credentialSubject.authorAvatar && <Avatar src={verifiableCredential.credentialSubject.authorAvatar} shape="circle" size={'small'}/> }
          {verifiableCredential.credentialSubject.authorName}
          <span className="divider">•</span> 
          {verifiableCredential.credentialSubject.channelName}
          <span className="divider">•</span> 
          {verifiableCredential.credentialSubject.guildName}
        </Space>
      </Typography.Text>
    </Row>
</div>;
}


export const KudosCredential2: React.FC<{credential: UniqueVerifiableCredential}> = ({ credential: { verifiableCredential } }) => {

  return <div className="message-embed">
  <div className="embed-content">
    <div className="embed-title description">🏆 Kudos to <a href={verifiableCredential.credentialSubject.id}>{verifiableCredential.credentialSubject.name}</a></div>
    <div className="embed-description description">{verifiableCredential.credentialSubject.kudos}</div>
    <div className="embed-footer"> 
      <img className="footer-icon" src={verifiableCredential.credentialSubject.authorAvatar} alt="" /> 
      <a href={verifiableCredential.credentialSubject.authorId}>{verifiableCredential.credentialSubject.authorName}</a> 
      <span className="divider">•</span> 
      <a href={
          `https://discord.com/channels/${verifiableCredential.credentialSubject.guildId}/${verifiableCredential.credentialSubject.channelId}/${verifiableCredential.id}`
        }>{verifiableCredential.credentialSubject.channelName}</a> 
      <span className="divider">•</span> 
      <a href={
          `https://discord.com/channels/${verifiableCredential.credentialSubject.guildId}/${verifiableCredential.credentialSubject.channelId}/${verifiableCredential.id}`
        }>{verifiableCredential.credentialSubject.guildName}</a>
    </div>
  </div>
  <div className="embed-thumbnail">
    <div className={`avatar-large ${!verifiableCredential.credentialSubject.avatar || verifiableCredential.credentialSubject.avatar === '' ? 'hidden' : ''}`}> <img src={verifiableCredential.credentialSubject.avatar} /> </div>
  </div>
</div>;
}

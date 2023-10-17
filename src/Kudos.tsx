import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer } from '@ant-design/pro-components'
import { IDataStore, IDataStoreORM } from '@veramo/core'
import { VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'
import { App, List } from 'antd'
import { ComposeKudosForm, ComposeKudosFormValues } from './ComposeKudosForm'

export const Kudos = () => {
  const navigate = useNavigate()
  const [pageSize, setPageSize] = React.useState(10)
  const [page, setPage] = React.useState(1)
  const { agent } = useVeramo<IDataStoreORM & IDataStore>()
  const { notification } = App.useApp()

  const { data: credentialsCount } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsCount({
        where: [{ column: 'type', value: ['VerifiableCredential,Kudos'] }],
      }),
  )

  const { data: credentials, isLoading, refetch } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [{ column: 'type', value: ['VerifiableCredential,Kudos'] }],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )

  const handleNewKudos = async (values: ComposeKudosFormValues, issuerAgent: any) => {
    const issuerProfile = await agent?.getIdentifierProfile({ did: values.issuer })
    const subjectProfile = await agent?.getIdentifierProfile({ did: values.subject })

    const credential = await issuerAgent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Kudos'],
        issuer: { id: values.issuer },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: values.subject,
          name: subjectProfile?.name,
          avatar: subjectProfile?.picture,
          kudos: values.kudos,
          
          "authorId": issuerProfile?.did,
          "authorName": issuerProfile?.name,
          "authorAvatar": issuerProfile?.picture,
          
          "channelId": "878293684620234755",
          "channelName": "💬｜general-chats",
          "guildId": "878293684620234752",
          "guildName": "Veramolabs",
          "guildAvatar": "https://cdn.discordapp.com/icons/878293684620234752/3a6e2e86c563b4f327e86d51289dd294.png",

        },
      },
    })

    if (credential) {
      await agent?.dataStoreSaveVerifiableCredential({verifiableCredential: credential})
      notification.success({
        message: 'Kudos sent',
      })
      refetch()
      
    }
  }

  return (
    <PageContainer>
      <ComposeKudosForm
        onNewKudos={handleNewKudos}
      />

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          position: 'both',
          pageSize: pageSize,
          current: page,
          total: credentialsCount,
          showSizeChanger: true,
          onChange(page, pageSize) {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
        dataSource={credentials}
        renderItem={(item) => (
          <div style={{marginTop: '20px'}}>
          <VerifiableCredentialComponent credential={item} />
          </div>
        )}
      />
      
    </PageContainer>
  )
}



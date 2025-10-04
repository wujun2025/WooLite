import React from 'react'
import { Typography, Card, Space, Divider } from 'antd'
import { useTranslation } from '../hooks/useTranslation'

const { Title, Text, Paragraph } = Typography

const About: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          {t('about.title')}
        </Title>
        
        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
          {t('about.description')}
        </Paragraph>
        
        <Divider />
        
        <Title level={3}>{t('about.projectHistory')}</Title>
        <Paragraph style={{ fontSize: '14px', lineHeight: '1.8' }}>
          {t('about.projectHistoryContent')}
        </Paragraph>
        
        <Paragraph style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <Text strong>GitHub:</Text> <a href="https://github.com/wujun2025/chrome-erp-woocommerce.git" target="_blank" rel="noopener noreferrer">
            https://github.com/wujun2025/chrome-erp-woocommerce.git
          </a>
        </Paragraph>
        
        <Divider />
        
        <Title level={3}>{t('about.developerStory')}</Title>
        <Paragraph style={{ fontSize: '14px', lineHeight: '1.8' }}>
          {t('about.developerStoryContent')}
        </Paragraph>
        
        <Divider />
        
        <Title level={3}>{t('about.features')}</Title>
        <ul>
          <li>{t('about.feature1')}</li>
          <li>{t('about.feature2')}</li>
          <li>{t('about.feature3')}</li>
          <li>{t('about.feature4')}</li>
        </ul>
        
        <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', padding: '12px', marginTop: '16px' }}>
          <Text strong style={{ color: '#52c41a' }}>{t('about.freeToUse')}</Text>
        </div>
        
        <Divider />
        
        <Title level={3}>{t('about.support')}</Title>
        <Paragraph>
          {t('about.supportDescription')}
        </Paragraph>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <img 
            src="/images/donation-qrcode.jpg" 
            alt={t('about.donationQRCode')} 
            style={{ maxWidth: '200px', height: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px' }}
          />
          <div style={{ marginTop: '12px' }}>
            <Text strong>{t('about.scanToSupport')}</Text>
          </div>
        </div>
        
        <Divider />
        
        <Title level={3}>{t('about.version')}</Title>
        <Text code>v1.0.4</Text>
        
        <Divider />
        
        <Title level={3}>{t('about.technologyStack')}</Title>
        <Space direction="vertical">
          <Text>• React 18</Text>
          <Text>• TypeScript</Text>
          <Text>• Zustand</Text>
          <Text>• Vite</Text>
          <Text>• Ant Design Pro</Text>
          <Text>• Chrome Extension Manifest V3</Text>
        </Space>
      </Card>
    </div>
  )
}

export default About
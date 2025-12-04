import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ChatPanel } from './components/ChatPanel';
import { AssetTree } from './components/AssetTree';
import { DetailPanel } from './components/DetailPanel';
import { ResizablePanel } from './components/ResizablePanel';

export interface Account {
  id: string;
  name: string;
  applyStatus: string;  // 账户申请状态
  status: string;  // 账户状态
  balance: string;
  consumption: string;  // 账户消耗
  giftAmount: string;  // 账户赠金
  currency: string;
  timezone: string;
  platform: string;
  companyName: string;  // 开户公司名称
  tags?: string[];  // 账户标签
  createdAt?: string;  // 创建时间
  authorizedBC?: string;  // 已授权BC
  authorizedEmail?: string;  // 已授权邮箱
}

export interface TreeFolder {
  id: string;
  name: string;
  type: 'folder';
  accounts: Account[];
  children?: TreeFolder[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'platform' | 'asset-type' | 'folder' | 'account' | 'license' | 'license-file';
  data?: Account;
  children?: TreeNode[];
}

export default function App() {
  const [activeNav, setActiveNav] = useState('资产');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'folder' | 'account';
    data: any;
  } | null>(null);

  // Panel width states
  const [chatPanelWidth, setChatPanelWidth] = useState(384); // 96 * 4 = 384px
  const [assetTreeWidth, setAssetTreeWidth] = useState(320); // 80 * 4 = 320px
  
  // Collapse states
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(false);

  const treeData: TreeNode[] = [
    {
      id: 'tiktok',
      name: 'TikTok',
      type: 'platform',
      children: [
        {
          id: 'tiktok-ad-accounts',
          name: '广告账户',
          type: 'asset-type',
          children: [
            {
              id: 'tiktok-taidong',
              name: '钛动账户',
              type: 'folder',
              children: Array.from({ length: 10 }, (_, i) => ((({
                id: `tiktok-taidong-${i}`,
                name: `账户 ${i + 1}`,
                type: 'account' as const,
                data: {
                  id: `TT-TD-${1000 + i}`,
                  name: `账户 ${i + 1}`,
                  applyStatus: Math.random() > 0.5 ? '已开通' : '申请中',
                  status: Math.random() > 0.3 ? '正常' : '暂停',
                  balance: `${(Math.random() * 10000).toFixed(2)}`,
                  consumption: `${(Math.random() * 5000).toFixed(2)}`,
                  giftAmount: `${(Math.random() * 1000).toFixed(2)}`,
                  currency: 'USD',
                  timezone: 'UTC+8',
                  platform: 'TikTok',
                  companyName: '上海钛动科技有限公司',
                  tags: i % 3 === 0 ? ['高优先级', 'VIP'] : i % 2 === 0 ? ['测试账户'] : [],
                  createdAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                  authorizedBC: i % 2 === 0 ? `BC-${1000 + i}` : undefined,
                  authorizedEmail: i % 3 === 0 ? `account${i}@taidong.com` : undefined,
                },
              })))), 
            },
            {
              id: 'tiktok-auth',
              name: '授权账户',
              type: 'folder',
              children: Array.from({ length: 5 }, (_, i) => ({
                id: `tiktok-auth-${i}`,
                name: `授权账户 ${i + 1}`,
                type: 'account' as const,
                data: {
                  id: `TT-AUTH-${2000 + i}`,
                  name: `授权账户 ${i + 1}`,
                  applyStatus: Math.random() > 0.5 ? '已开通' : '申请中',
                  status: Math.random() > 0.3 ? '正常' : '暂停',
                  balance: `${(Math.random() * 8000).toFixed(2)}`,
                  consumption: `${(Math.random() * 4000).toFixed(2)}`,
                  giftAmount: `${(Math.random() * 800).toFixed(2)}`,
                  currency: 'USD',
                  timezone: 'UTC+8',
                  platform: 'TikTok',
                  companyName: '北京钛动科技有限公司',
                },
              })),
            },
            {
              id: 'tiktok-custom',
              name: '自定义文件夹',
              type: 'folder',
              children: Array.from({ length: 5 }, (_, i) => ({
                id: `tiktok-custom-${i}`,
                name: `自定义账户 ${i + 1}`,
                type: 'account' as const,
                data: {
                  id: `TT-CUSTOM-${3000 + i}`,
                  name: `自定义账户 ${i + 1}`,
                  applyStatus: Math.random() > 0.5 ? '已开通' : '申请中',
                  status: Math.random() > 0.3 ? '正常' : '暂停',
                  balance: `${(Math.random() * 12000).toFixed(2)}`,
                  consumption: `${(Math.random() * 6000).toFixed(2)}`,
                  giftAmount: `${(Math.random() * 1200).toFixed(2)}`,
                  currency: 'USD',
                  timezone: 'UTC+8',
                  platform: 'TikTok',
                  companyName: '深圳钛动科技有限公司',
                },
              })),
            },
          ],
        },
        {
          id: 'tiktok-pixel',
          name: 'Pixel',
          type: 'asset-type',
          children: [],
        },
        {
          id: 'tiktok-shop',
          name: '商店',
          type: 'asset-type',
          children: [],
        },
        {
          id: 'tiktok-bc',
          name: 'BC',
          type: 'asset-type',
          children: [],
        },
      ],
    },
    {
      id: 'meta',
      name: 'Meta',
      type: 'platform',
      children: [
        {
          id: 'meta-ad-accounts',
          name: '广告账户',
          type: 'asset-type',
          children: [
            {
              id: 'meta-taidong',
              name: '钛动账户',
              type: 'folder',
              children: Array.from({ length: 8 }, (_, i) => ({
                id: `meta-taidong-${i}`,
                name: `Meta账户 ${i + 1}`,
                type: 'account' as const,
                data: {
                  id: `META-TD-${4000 + i}`,
                  name: `Meta账户 ${i + 1}`,
                  applyStatus: Math.random() > 0.5 ? '已开通' : '申请中',
                  status: Math.random() > 0.3 ? '正常' : '暂停',
                  balance: `${(Math.random() * 15000).toFixed(2)}`,
                  consumption: `${(Math.random() * 7500).toFixed(2)}`,
                  giftAmount: `${(Math.random() * 1500).toFixed(2)}`,
                  currency: 'USD',
                  timezone: 'UTC+8',
                  platform: 'Meta',
                  companyName: '广州钛动科技有限公司',
                },
              })),
            },
            {
              id: 'meta-auth',
              name: '授权账户',
              type: 'folder',
              children: Array.from({ length: 3 }, (_, i) => ({
                id: `meta-auth-${i}`,
                name: `授权账户 ${i + 1}`,
                type: 'account' as const,
                data: {
                  id: `META-AUTH-${5000 + i}`,
                  name: `授权账户 ${i + 1}`,
                  applyStatus: Math.random() > 0.5 ? '已开通' : '申请中',
                  status: Math.random() > 0.3 ? '正常' : '暂停',
                  balance: `${(Math.random() * 8000).toFixed(2)}`,
                  consumption: `${(Math.random() * 4000).toFixed(2)}`,
                  giftAmount: `${(Math.random() * 800).toFixed(2)}`,
                  currency: 'USD',
                  timezone: 'UTC+8',
                  platform: 'Meta',
                  companyName: '上海钛动科技有限公司',
                },
              })),
            },
          ],
        },
        {
          id: 'meta-pixel',
          name: 'Pixel',
          type: 'asset-type',
          children: [],
        },
        {
          id: 'meta-bm',
          name: 'BM',
          type: 'asset-type',
          children: [],
        },
      ],
    },
    {
      id: 'google',
      name: 'Google',
      type: 'platform',
      children: [
        {
          id: 'google-ad-accounts',
          name: '广告账',
          type: 'asset-type',
          children: [
            {
              id: 'google-taidong',
              name: '钛动账户',
              type: 'folder',
              children: Array.from({ length: 6 }, (_, i) => ({
                id: `google-taidong-${i}`,
                name: `Google账户 ${i + 1}`,
                type: 'account' as const,
                data: {
                  id: `GOOGLE-TD-${6000 + i}`,
                  name: `Google账户 ${i + 1}`,
                  applyStatus: Math.random() > 0.5 ? '已开通' : '申请中',
                  status: Math.random() > 0.3 ? '正常' : '暂停',
                  balance: `${(Math.random() * 20000).toFixed(2)}`,
                  consumption: `${(Math.random() * 10000).toFixed(2)}`,
                  giftAmount: `${(Math.random() * 2000).toFixed(2)}`,
                  currency: 'USD',
                  timezone: 'UTC+8',
                  platform: 'Google',
                  companyName: '北京钛动科技有限公司',
                },
              })),
            },
          ],
        },
        {
          id: 'google-pixel',
          name: 'Pixel',
          type: 'asset-type',
          children: [],
        },
        {
          id: 'google-mcc',
          name: 'MCC',
          type: 'asset-type',
          children: [],
        },
      ],
    },
    {
      id: 'licenses',
      name: '营业执照',
      type: 'license',
      children: [
        {
          id: 'license-1',
          name: '上海钛动科技有限公司',
          type: 'license-file',
          children: [],
        },
        {
          id: 'license-2',
          name: '北京钛动科技有限公司',
          type: 'license-file',
          children: [],
        },
        {
          id: 'license-3',
          name: '深圳钛动科技有限公司',
          type: 'license-file',
          children: [],
        },
        {
          id: 'license-4',
          name: '广州钛动科技有限公司',
          type: 'license-file',
          children: [],
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* 第一列：一级导航 */}
      <Navigation activeNav={activeNav} onNavChange={setActiveNav} />

      {/* 第二列：LUI对话框 - 可调整大小 */}
      <ResizablePanel
        width={chatPanelWidth}
        minWidth={300}
        maxWidth={600}
        onResize={setChatPanelWidth}
        isCollapsed={isChatCollapsed}
        onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
        position="left"
      >
        <ChatPanel />
      </ResizablePanel>

      {/* 第三列：资产树 - 可调整大小 */}
      <ResizablePanel
        width={assetTreeWidth}
        minWidth={280}
        maxWidth={500}
        onResize={setAssetTreeWidth}
        position="middle"
      >
        <AssetTree treeData={treeData} onSelectItem={setSelectedItem} />
      </ResizablePanel>

      {/* 第四列：详情面板 - 可展开/收起 */}
      <div className="flex-1 flex flex-col relative">
        <DetailPanel 
          selectedItem={selectedItem}
          isCollapsed={isDetailCollapsed}
          onToggleCollapse={() => setIsDetailCollapsed(!isDetailCollapsed)}
        />
      </div>
    </div>
  );
}
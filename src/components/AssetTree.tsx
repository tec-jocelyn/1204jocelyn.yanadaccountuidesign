import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Briefcase, ClipboardList, Building2 } from 'lucide-react';
import type { TreeNode } from '../App';

interface AssetTreeProps {
  treeData: TreeNode[];
  onSelectItem: (item: { type: 'folder' | 'account'; data: any }) => void;
}

type TabType = '媒体资产' | '任务中心' | '个人资产';

export function AssetTree({ treeData, onSelectItem }: AssetTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['media-assets', 'tiktok', 'tiktok-ad-accounts']));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('媒体资产');

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = (node: any, nodeType: 'folder' | 'account') => {
    setSelectedNode(node.id);
    
    if (nodeType === 'folder') {
      onSelectItem({
        type: 'folder',
        data: {
          name: node.name,
          accounts: collectAccounts(node),
        },
      });
    } else {
      onSelectItem({
        type: 'account',
        data: node.data,
      });
    }
  };

  const collectAccounts = (node: any): any[] => {
    if (!node.children) return [];
    
    const accounts: any[] = [];
    for (const child of node.children) {
      if (child.type === 'account' && child.data) {
        accounts.push(child.data);
      }
      if (child.children) {
        accounts.push(...collectAccounts(child));
      }
    }
    return accounts;
  };

  // 媒体资产数据
  const mediaAssets = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      children: [
        {
          id: 'tiktok-ad-accounts',
          name: '广告账户',
          children: [
            {
              id: 'tiktok-taidong',
              name: '钛动账户',
              type: 'folder',
              children: Array.from({ length: 15 }, (_, i) => ({
                id: `tiktok-account-${i}`,
                name: `账户${i + 1} (TT-TD-${1000 + i})`,
                type: 'account',
                data: {
                  id: `TT-TD-${1000 + i}`,
                  name: `账户${i + 1}`,
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
              })),
            },
            {
              id: 'tiktok-auth',
              name: '授权账户',
              type: 'folder',
              children: Array.from({ length: 5 }, (_, i) => ({
                id: `tiktok-auth-${i}`,
                name: `授权账户${i + 1} (TT-AUTH-${2000 + i})`,
                type: 'account',
                data: {
                  id: `TT-AUTH-${2000 + i}`,
                  name: `授权账户${i + 1}`,
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
          ],
        },
        {
          id: 'tiktok-bc',
          name: 'BC',
          children: [
            {
              id: 'tiktok-authorized-bc',
              name: '授权BC',
              type: 'folder',
              children: [
                { id: 'bc-1', name: 'BC-1001', type: 'bc' },
                { id: 'bc-2', name: 'BC-1002', type: 'bc' },
              ],
            },
          ],
        },
        {
          id: 'tiktok-pixel',
          name: 'Pixel',
          children: [
            {
              id: 'tiktok-authorized-pixel',
              name: '授权Pixel',
              type: 'folder',
              children: [
                { id: 'pixel-1', name: 'PIXEL-2001', type: 'pixel' },
                { id: 'pixel-2', name: 'PIXEL-2002', type: 'pixel' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'meta',
      name: 'Meta',
      icon: '📘',
      children: [
        {
          id: 'meta-ad-accounts',
          name: '广告账户',
          children: [
            {
              id: 'meta-taidong',
              name: '钛动账户',
              type: 'folder',
              children: Array.from({ length: 8 }, (_, i) => ({
                id: `meta-account-${i}`,
                name: `Meta账户${i + 1} (META-TD-${4000 + i})`,
                type: 'account',
                data: {
                  id: `META-TD-${4000 + i}`,
                  name: `Meta账户${i + 1}`,
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
          ],
        },
      ],
    },
  ];

  // 任务中心数据
  const taskCenter = [
    {
      id: 'application-center',
      name: '申请中心',
      children: [
        {
          id: 'account-opening',
          name: '开户申请',
          children: [
            { id: 'draft', name: '草稿', type: 'status', count: 3 },
            { id: 'reviewing', name: '审核中', type: 'status', count: 5 },
            { id: 'need-modify', name: '待修改', type: 'status', count: 2 },
            { id: 'completed', name: '已结束', type: 'status', count: 12 },
          ],
        },
        {
          id: 'budget-application',
          name: '账户预算申请',
          children: [
            { id: 'budget-draft', name: '草稿', type: 'status', count: 1 },
            { id: 'budget-reviewing', name: '审核中', type: 'status', count: 3 },
            { id: 'budget-completed', name: '已结束', type: 'status', count: 8 },
          ],
        },
        {
          id: 'binding-application',
          name: '绑定/解绑申请',
          children: [
            { id: 'binding-draft', name: '草稿', type: 'status', count: 0 },
            { id: 'binding-reviewing', name: '审核中', type: 'status', count: 2 },
            { id: 'binding-completed', name: '已结束', type: 'status', count: 15 },
          ],
        },
      ],
    },
  ];

  // 个人资产数据
  const personalAssets = [
    {
      id: 'business-licenses',
      name: '营业执照集合',
      children: [
        { id: 'license-1', name: '上海钛动科技有限公司', type: 'license' },
        { id: 'license-2', name: '北京钛动科技有限公司', type: 'license' },
        { id: 'license-3', name: '深圳钛动科技有限公司', type: 'license' },
        { id: 'license-4', name: '广州钛动科技有限公司', type: 'license' },
      ],
    },
  ];

  const TreeNodeComponent = ({ node, level = 0 }: { node: any; level?: number }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;
    const isLeaf = node.type === 'account' || node.type === 'bc' || node.type === 'pixel' || node.type === 'license' || node.type === 'status';

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
            isSelected
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (hasChildren && !isLeaf) {
              toggleNode(node.id);
            }
            if (node.type === 'folder' || node.type === 'account') {
              handleNodeClick(node, node.type);
            }
          }}
        >
          {hasChildren && !isLeaf && (
            <span className="flex-shrink-0">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          {!hasChildren || isLeaf ? <span className="w-4" /> : null}
          
          {node.icon && <span className="text-lg">{node.icon}</span>}
          {!node.icon && level > 0 && <Folder size={16} className="text-gray-400" />}
          
          <span className="flex-1 text-sm truncate">{node.name}</span>
          
          {node.count !== undefined && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
              {node.count}
            </span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => (
              <TreeNodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case '媒体资产':
        return mediaAssets;
      case '任务中心':
        return taskCenter;
      case '个人资产':
        return personalAssets;
      default:
        return [];
    }
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Tab Header */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        {(['媒体资产', '任务中心', '个人资产'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm transition-colors relative ${
              activeTab === tab
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab === '媒体资产' && <Briefcase size={16} />}
              {tab === '任务中心' && <ClipboardList size={16} />}
              {tab === '个人资产' && <Building2 size={16} />}
              {tab}
            </div>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-2">
        {getCurrentData().map((node) => (
          <TreeNodeComponent key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}

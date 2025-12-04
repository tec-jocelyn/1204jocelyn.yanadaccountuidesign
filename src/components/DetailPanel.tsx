import React, { useState } from 'react';
import { Plus, DollarSign, Minus, RotateCcw, Link, Mail, Edit, Tag, Eye, MoreHorizontal, Settings2, ChevronDown, X, ChevronLeft, ChevronRight, Download, Unlink, MailX, AlertCircle, TrendingUp, TrendingDown, Ban, Clock, User, FileText, Calendar, Wallet } from 'lucide-react';
import type { Account } from '../App';

interface DetailPanelProps {
  selectedItem: {
    type: 'folder' | 'account';
    data: any;
  } | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type ActionType = 'recharge' | 'deduct' | 'clear' | 'bindBC' | 'unbindBC' | 'bindEmail' | 'unbindEmail' | 'rename' | 'tag' | null;

interface ColumnConfig {
  key: keyof Account | 'select' | 'actions';
  label: string;
  visible: boolean;
}

interface OperationRecord {
  id: string;
  operationType: string;
  operator: string;
  operationTime: string;
  ticketId: string;
  status: '审批中' | '已成功' | '已失败';
}

// Mock operation records
const mockOperationRecords: OperationRecord[] = [
  { id: '1', operationType: '充值', operator: '张三', operationTime: '2024-11-20 10:30:00', ticketId: 'TK-001', status: '已成功' },
  { id: '2', operationType: '绑定BC', operator: '李四', operationTime: '2024-11-19 15:20:00', ticketId: 'TK-002', status: '已成功' },
  { id: '3', operationType: '更名', operator: '王五', operationTime: '2024-11-18 09:15:00', ticketId: 'TK-003', status: '审批中' },
  { id: '4', operationType: '减款', operator: '赵六', operationTime: '2024-11-17 14:45:00', ticketId: 'TK-004', status: '已失败' },
  { id: '5', operationType: '绑定邮箱', operator: '张三', operationTime: '2024-11-16 11:20:00', ticketId: 'TK-005', status: '已成功' },
];

export function DetailPanel({ selectedItem, isCollapsed, onToggleCollapse }: DetailPanelProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [filterIdOrName, setFilterIdOrName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [actionAmount, setActionAmount] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'select', label: '', visible: true },
    { key: 'id', label: '账户ID', visible: true },
    { key: 'name', label: '账户名称', visible: true },
    { key: 'applyStatus', label: '账户申请状态', visible: true },
    { key: 'status', label: '账户状态', visible: true },
    { key: 'balance', label: '账户余额', visible: true },
    { key: 'consumption', label: '账户消耗', visible: true },
    { key: 'giftAmount', label: '账户赠金', visible: true },
    { key: 'currency', label: '币种', visible: true },
    { key: 'timezone', label: '时区', visible: false },
    { key: 'companyName', label: '开户公司名称', visible: true },
    { key: 'actions', label: '操作', visible: true },
  ]);

  if (!selectedItem) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Plus size={48} className="mx-auto mb-4 opacity-50" />
          <p>请在左侧选择账户或文件夹</p>
          <p className="text-sm mt-2">查看详细信息或批量管理</p>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'account') {
    const account: Account = selectedItem.data;
    
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {/* Collapse/Expand Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute top-4 left-2 z-20 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors border border-gray-300"
            title={isCollapsed ? '展开' : '收起'}
          >
            {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        {!isCollapsed && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl mb-2 text-gray-900">{account.name}</h1>
                  <p className="text-gray-600">{account.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    account.status === '正常'
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-yellow-500/10 text-yellow-600'
                  }`}
                >
                  {account.status}
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6 space-y-6">
                {/* Section 1: Account Properties */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg mb-4 flex items-center gap-2 text-gray-900">
                    <FileText size={20} />
                    账户属性
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label className="text-gray-600 text-sm">账户名称</label>
                      <div className="mt-1 text-gray-900">{account.name}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户ID</label>
                      <div className="mt-1 text-blue-600">{account.id}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">开户公司主体</label>
                      <div className="mt-1 text-gray-900">{account.companyName || '未设置'}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户状态</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 rounded text-xs ${
                          account.status === '正常'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户余额</label>
                      <div className="mt-1 text-green-600">${account.balance} {account.currency}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户消耗</label>
                      <div className="mt-1 text-gray-900">${account.consumption || '0.00'} {account.currency}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户赠金</label>
                      <div className="mt-1 text-purple-600">${account.giftAmount || '0.00'} {account.currency}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户标签</label>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        {account.tags && account.tags.length > 0 ? (
                          account.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded text-xs">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">未设置</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户时区</label>
                      <div className="mt-1 text-gray-900">{account.timezone}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">账户币种</label>
                      <div className="mt-1 text-gray-900">{account.currency}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">创建时间</label>
                      <div className="mt-1 text-gray-900">{account.createdAt || '未知'}</div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">已授权BC</label>
                      <div className="mt-1">
                        {account.authorizedBC ? (
                          <span className="text-blue-600">{account.authorizedBC}</span>
                        ) : (
                          <span className="text-gray-500">未绑定</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">已授权邮箱</label>
                      <div className="mt-1">
                        {account.authorizedEmail ? (
                          <span className="text-blue-600">{account.authorizedEmail}</span>
                        ) : (
                          <span className="text-gray-500">未绑定</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Operation Records */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg mb-4 flex items-center gap-2 text-gray-900">
                    <Clock size={20} />
                    操作记录
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm text-gray-600">操作类型</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">操作人</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">操作时间</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">关联工单ID</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">操作状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOperationRecords.map((record) => (
                          <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-4 text-sm text-gray-900">
                              <span className="inline-flex items-center gap-1">
                                {record.operationType === '充值' && <DollarSign size={14} className="text-green-600" />}
                                {record.operationType === '减款' && <Minus size={14} className="text-red-600" />}
                                {record.operationType === '绑定BC' && <Link size={14} className="text-blue-600" />}
                                {record.operationType === '绑定邮箱' && <Mail size={14} className="text-blue-600" />}
                                {record.operationType === '更名' && <Edit size={14} className="text-yellow-600" />}
                                {record.operationType}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">{record.operator}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{record.operationTime}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className="text-blue-600">{record.ticketId}</span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded text-xs ${
                                record.status === '已成功'
                                  ? 'bg-green-500/10 text-green-600'
                                  : record.status === '审批中'
                                  ? 'bg-blue-500/10 text-blue-600'
                                  : 'bg-red-500/10 text-red-600'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Folder view with new three-section layout
  const { name, accounts } = selectedItem.data;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(new Set(paginatedAccounts.map(acc => acc.id)));
    } else {
      setSelectedAccounts(new Set());
    }
  };

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    const newSet = new Set(selectedAccounts);
    if (checked) {
      newSet.add(accountId);
    } else {
      newSet.delete(accountId);
    }
    setSelectedAccounts(newSet);
  };

  const toggleColumnVisibility = (key: string) => {
    setColumns(columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((account: Account) => {
    const matchIdOrName = !filterIdOrName || 
      account.id.toLowerCase().includes(filterIdOrName.toLowerCase()) ||
      account.name.toLowerCase().includes(filterIdOrName.toLowerCase());
    
    const matchStatus = !filterStatus || account.status === filterStatus;
    
    return matchIdOrName && matchStatus;
  });

  // Pagination
  const totalItems = filteredAccounts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Calculate statistics
  const totalBalance = filteredAccounts.reduce((sum: number, acc: Account) => sum + parseFloat(acc.balance || '0'), 0);
  const totalConsumption = filteredAccounts.reduce((sum: number, acc: Account) => sum + parseFloat(acc.consumption || '0'), 0);
  const emptyAccountCount = filteredAccounts.filter((acc: Account) => parseFloat(acc.balance || '0') === 0).length;
  const blockedAccountCount = filteredAccounts.filter((acc: Account) => acc.status !== '正常').length;
  const emptyAccountRate = filteredAccounts.length > 0 ? ((emptyAccountCount / filteredAccounts.length) * 100).toFixed(1) : '0.0';
  const blockedAccountRate = filteredAccounts.length > 0 ? ((blockedAccountCount / filteredAccounts.length) * 100).toFixed(1) : '0.0';

  // Mock wallet balance
  const walletBalance = 150000.00;

  const handleActionSubmit = () => {
    console.log('Action:', activeAction, 'Amount:', actionAmount, 'Accounts:', selectedAccounts);
    setActiveAction(null);
    setActionAmount('');
    setSelectedAccounts(new Set());
  };

  const handleExport = () => {
    console.log('Exporting table data...');
    // Export functionality
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedAccounts(new Set()); // Clear selection when changing page
  };

  // Action Form Modal
  const ActionModal = () => {
    if (!activeAction) return null;

    const actionTitles: Record<string, string> = {
      recharge: '充值',
      deduct: '减款',
      clear: '清零',
      bindBC: '绑定BC',
      unbindBC: '解绑BC',
      bindEmail: '绑定邮箱',
      unbindEmail: '解绑邮箱',
      rename: '更名',
      tag: '贴标签',
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[500px] border border-gray-200 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">{actionTitles[activeAction]}</h3>
            <button onClick={() => setActiveAction(null)} className="text-gray-500 hover:text-gray-900">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">
                已选择 {selectedAccounts.size} 个账户
              </label>
            </div>

            {(activeAction === 'recharge' || activeAction === 'deduct') && (
              <div>
                <label className="text-sm text-gray-600 block mb-2">金额 (USD)</label>
                <input
                  type="number"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入金额"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {(activeAction === 'bindBC' || activeAction === 'unbindBC') && (
              <div>
                <label className="text-sm text-gray-600 block mb-2">BC账号</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder={activeAction === 'bindBC' ? '请输入BC账号' : '确认解绑BC账号'}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {(activeAction === 'bindEmail' || activeAction === 'unbindEmail') && (
              <div>
                <label className="text-sm text-gray-600 block mb-2">邮箱地址</label>
                <input
                  type="email"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder={activeAction === 'bindEmail' ? '请输入邮箱地址' : '确认解绑邮箱'}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'rename' && (
              <div>
                <label className="text-sm text-gray-600 block mb-2">新名称</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入新名称"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'tag' && (
              <div>
                <label className="text-sm text-gray-600 block mb-2">标签</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入标签，多个标签用逗号分隔"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'clear' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-600 text-sm font-medium">警告</p>
                    <p className="text-gray-600 text-sm mt-1">
                      此操作将清零所选账户的余额，该操作不可恢复，请谨慎操作。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleActionSubmit}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white ${
                  activeAction === 'clear'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                确认
              </button>
              <button
                onClick={() => setActiveAction(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-900"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Action Dropdown Menu
  const ActionDropdown = ({ accountId }: { accountId: string }) => {
    if (activeDropdown !== accountId) return null;

    return (
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
        <div className="py-1">
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('recharge');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <DollarSign size={14} />
            充值
          </button>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('deduct');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <Minus size={14} />
            减款
          </button>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('clear');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
          >
            <RotateCcw size={14} />
            清零
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('bindBC');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <Link size={14} />
            绑定BC
          </button>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('unbindBC');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <Unlink size={14} />
            解绑BC
          </button>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('bindEmail');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <Mail size={14} />
            绑定邮箱
          </button>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('unbindEmail');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <MailX size={14} />
            解绑邮箱
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('rename');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <Edit size={14} />
            更名
          </button>
          <button
            onClick={() => {
              setSelectedAccounts(new Set([accountId]));
              setActiveAction('tag');
              setActiveDropdown(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
          >
            <Tag size={14} />
            贴标签
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
      {/* Collapse/Expand Button for DetailPanel */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-4 left-2 z-20 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors border border-gray-300"
          title={isCollapsed ? '展开' : '收起'}
        >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}

      {!isCollapsed && (
        <>
          {/* Section 1: Title Area */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h1 className="text-2xl mb-1 text-gray-900">{name}</h1>
              <p className="text-gray-600 text-sm">共 {accounts.length} 个账户</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={16} />
              开户
            </button>
          </div>

          {/* Section 2: Key Metrics Area */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">空户率</span>
                  <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle size={16} className="text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl text-orange-600">{emptyAccountRate}%</div>
                <div className="text-xs text-gray-500 mt-1">{emptyAccountCount} 个空户</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">封户率</span>
                  <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Ban size={16} className="text-red-600" />
                  </div>
                </div>
                <div className="text-2xl text-red-600">{blockedAccountRate}%</div>
                <div className="text-xs text-gray-500 mt-1">{blockedAccountCount} 个封户</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">账户总余额</span>
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={16} className="text-green-600" />
                  </div>
                </div>
                <div className="text-2xl text-green-600">${totalBalance.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">USD</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">累计花费</span>
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl text-blue-600">${totalConsumption.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">USD</div>
              </div>
            </div>
          </div>

          {/* Section 3: Table Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Batch Action Bar - Only show when accounts are selected */}
            {selectedAccounts.size > 0 && (
              <div className="px-6 py-3 bg-blue-600/10 border-b border-blue-600/20 flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-blue-600">已选择 {selectedAccounts.size} 个账户</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveAction('recharge')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <DollarSign size={14} />
                    充值
                  </button>
                  <button
                    onClick={() => setActiveAction('deduct')}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Minus size={14} />
                    减款
                  </button>
                  <button
                    onClick={() => setActiveAction('clear')}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={14} />
                    清零
                  </button>
                  <button
                    onClick={() => setActiveAction('bindBC')}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Link size={14} />
                    绑定BC
                  </button>
                  <button
                    onClick={() => setActiveAction('bindEmail')}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Mail size={14} />
                    绑定���箱
                  </button>
                  <button
                    onClick={() => setActiveAction('rename')}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Edit size={14} />
                    更名
                  </button>
                  <button
                    onClick={() => setActiveAction('tag')}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Tag size={14} />
                    贴标签
                  </button>
                </div>
                <button
                  onClick={() => setSelectedAccounts(new Set())}
                  className="ml-auto text-sm text-gray-500 hover:text-gray-900"
                >
                  取消选择
                </button>
              </div>
            )}

            {/* Wallet Balance & Filter and Controls Bar */}
            <div className="px-6 py-4 border-b border-gray-200 space-y-3 flex-shrink-0">
              {/* Wallet Balance */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Wallet size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">钱包可用余额</p>
                      <p className="text-2xl text-blue-600 mt-1">${walletBalance.toFixed(2)} USD</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors text-white">
                    充值钱包
                  </button>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={filterIdOrName}
                  onChange={(e) => setFilterIdOrName(e.target.value)}
                  placeholder="搜索账户ID/名称"
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">全部状态</option>
                  <option value="正常">正常</option>
                  <option value="暂停">暂停</option>
                </select>
                <button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2 transition-colors text-gray-900"
                >
                  <Settings2 size={16} />
                  高级筛选
                </button>
                <button
                  onClick={() => setShowColumnConfig(!showColumnConfig)}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2 transition-colors text-gray-900"
                >
                  <Eye size={16} />
                  列设置
                </button>
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2 transition-colors text-gray-900"
                >
                  <Download size={16} />
                  导出
                </button>
              </div>

              {showColumnConfig && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">选择要显示的列</p>
                  <div className="grid grid-cols-4 gap-3">
                    {columns.filter(col => col.key !== 'select' && col.key !== 'actions').map(col => (
                      <label key={col.key} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 text-gray-900">
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => toggleColumnVisibility(col.key)}
                          className="rounded"
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b border-gray-200">
                    {columns.filter(col => col.visible).map(col => (
                      <th key={col.key} className="text-left py-3 px-4 text-sm text-gray-500">
                        {col.key === 'select' ? (
                          <input
                            type="checkbox"
                            checked={selectedAccounts.size === paginatedAccounts.length && paginatedAccounts.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded"
                          />
                        ) : (
                          col.label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAccounts.map((account: Account) => (
                    <tr
                      key={account.id}
                      className={`border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors ${
                        selectedAccounts.has(account.id) ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      {columns.filter(col => col.visible).map(col => {
                        if (col.key === 'select') {
                          return (
                            <td key="select" className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedAccounts.has(account.id)}
                                onChange={(e) => handleSelectAccount(account.id, e.target.checked)}
                                className="rounded"
                              />
                            </td>
                          );
                        }
                        
                        if (col.key === 'actions') {
                          return (
                            <td key="actions" className="py-3 px-4 relative">
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === account.id ? null : account.id)}
                                className="text-gray-500 hover:text-gray-900 p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                              <ActionDropdown accountId={account.id} />
                            </td>
                          );
                        }

                        const value = account[col.key as keyof Account];
                        
                        if (col.key === 'id') {
                          return <td key={col.key} className="py-3 px-4 text-sm text-blue-600">{value}</td>;
                        }
                        
                        if (col.key === 'status') {
                          return (
                            <td key={col.key} className="py-3 px-4">
                              <span
                                className={`inline-flex px-2 py-1 rounded text-xs ${
                                  value === '正常'
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-yellow-500/10 text-yellow-600'
                                }`}
                              >
                                {value}
                              </span>
                            </td>
                          );
                        }

                        if (col.key === 'applyStatus') {
                          return (
                            <td key={col.key} className="py-3 px-4">
                              <span
                                className={`inline-flex px-2 py-1 rounded text-xs ${
                                  value === '已开通'
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-blue-500/10 text-blue-600'
                                }`}
                              >
                                {value || '未知'}
                              </span>
                            </td>
                          );
                        }

                        if (col.key === 'balance' || col.key === 'consumption' || col.key === 'giftAmount') {
                          return (
                            <td key={col.key} className="py-3 px-4 text-sm">
                              ${value || '0.00'}
                            </td>
                          );
                        }

                        return (
                          <td key={col.key} className="py-3 px-4 text-sm">
                            {value || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  共 {totalItems} 条记录，第 {startIndex + 1}-{Math.min(endIndex, totalItems)} 条
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value={10}>10 条/页</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                  <option value={100}>100 条/页</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  上一页
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>

          {/* Action Modal */}
          <ActionModal />
        </>
      )}
      
      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}

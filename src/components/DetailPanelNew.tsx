import React, { useState } from 'react';
import { Plus, DollarSign, Minus, RotateCcw, Link, Mail, Edit, Tag, Eye, MoreHorizontal, Settings2, ChevronDown, X, ChevronLeft, ChevronRight, Download, Unlink, MailX, AlertCircle, TrendingUp, TrendingDown, Ban, Clock, User, FileText, Calendar, Wallet, Filter, ArrowUpDown, ChevronUp } from 'lucide-react';
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
  defaultVisible: boolean;
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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [actionAmount, setActionAmount] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof Account | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter states
  const [filters, setFilters] = useState({
    nameMatch: 'fuzzy', // fuzzy or prefix
    name: '',
    idMatch: 'exact', // exact or prefix
    ids: '',
    companyNames: [] as string[],
    statuses: [] as string[],
    balanceMin: '',
    balanceMax: '',
    balanceQuickFilter: '', // <3day, <7day
    consumptionPeriod: '', // 3day, 7day, 30day, all
    giftAmountMin: '',
    giftAmountMax: '',
    tags: [] as string[],
    timezones: [] as string[],
    currencies: [] as string[],
    createdStart: '',
    createdEnd: '',
    createdQuickFilter: '', // 7day, 30day, thisMonth
    authorizedBCs: [] as string[],
    authorizedEmails: [] as string[],
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'select', label: '', visible: true, defaultVisible: true },
    { key: 'id', label: '账户ID', visible: true, defaultVisible: true },
    { key: 'name', label: '账户名称', visible: true, defaultVisible: true },
    { key: 'status', label: '账户状态', visible: true, defaultVisible: true },
    { key: 'balance', label: '账户余额', visible: true, defaultVisible: true },
    { key: 'consumption', label: '账户消耗', visible: true, defaultVisible: true },
    { key: 'companyName', label: '开户公司主体', visible: false, defaultVisible: false },
    { key: 'giftAmount', label: '账户赠金', visible: false, defaultVisible: false },
    { key: 'tags', label: '账户标签', visible: false, defaultVisible: false },
    { key: 'timezone', label: '账户时区', visible: false, defaultVisible: false },
    { key: 'currency', label: '账户币种', visible: false, defaultVisible: false },
    { key: 'createdAt', label: '创建时间', visible: false, defaultVisible: false },
    { key: 'authorizedBC', label: '已授权BC', visible: false, defaultVisible: false },
    { key: 'authorizedEmail', label: '已授权邮箱', visible: false, defaultVisible: false },
    { key: 'actions', label: '操作', visible: true, defaultVisible: true },
  ]);

  if (!selectedItem) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center text-gray-400">
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
            className="absolute top-4 left-2 z-20 w-6 h-6 bg-white hover:bg-gray-100 rounded flex items-center justify-center transition-colors border border-gray-300 shadow-sm"
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
                  <h1 className="text-2xl mb-2">{account.name}</h1>
                  <p className="text-gray-500">{account.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    account.status === '正常'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
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
                  <h3 className="text-lg mb-4 flex items-center gap-2">
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
                            ? 'bg-green-50 text-green-600'
                            : 'bg-yellow-50 text-yellow-600'
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
                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
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
                  <h3 className="text-lg mb-4 flex items-center gap-2">
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
                      <tbody className="bg-white">
                        {mockOperationRecords.map((record) => (
                          <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">
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
                            <td className="py-3 px-4 text-sm text-gray-500">{record.operationTime}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className="text-blue-600">{record.ticketId}</span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded text-xs ${
                                record.status === '已成功'
                                  ? 'bg-green-50 text-green-600'
                                  : record.status === '审批中'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-red-50 text-red-600'
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

  // Folder view continues in next message due to length...
  return <div className="flex-1 bg-white">Folder view implementation continues...</div>;
}

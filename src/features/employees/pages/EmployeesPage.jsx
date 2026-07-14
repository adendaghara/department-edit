import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button, ConfirmDialog, Toast, useToast } from '../../../shared/index.js';
import { EmployeeDialog } from '../components/EmployeeDialog.jsx';
import { employeesFullAPI, mockEmployees, mockDepartments, departmentsAPI } from '../../../api.js';
import '../../../styles/departments.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


export function EmployeesPage() {
  const { t }   = useTranslation();
  const gridRef = useRef(null);
  const { toast, show: showToast } = useToast();

  const [rowData, setRowData]           = useState([]);
  const [departments, setDepartments]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editingEmp, setEditingEmp]     = useState(null);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [deletingEmp, setDeletingEmp]   = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [emps, depts] = await Promise.all([
        employeesFullAPI.getAll(),
        departmentsAPI.getAll(),
      ]);
      setRowData(Array.isArray(emps) ? emps : emps.data || []);
      setDepartments(Array.isArray(depts) ? depts : depts.data || []);
    } catch {
      setRowData(mockEmployees);
      setDepartments(mockDepartments);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const getDeptName = useCallback((deptId) => {
    const d = departments.find(d => String(d.id) === String(deptId));
    return d ? d.nameAr : '—';
  }, [departments]);

  const openAdd  = useCallback(() => { setEditingEmp(null); setDialogOpen(true); }, []);
  const openEdit = useCallback((data) => { setEditingEmp(data); setDialogOpen(true); }, []);
  const openDel  = useCallback((data) => { setDeletingEmp(data); setConfirmOpen(true); }, []);

  const ActionsRenderer = useCallback(({ data }) => (
    <div className="actions-cell">
      <Button variant="icon" size="sm" title={t('employees.edit')} onClick={() => openEdit(data)}>
        <Pencil size={14} />
      </Button>
      <Button variant="icon" size="sm" title={t('employees.delete')} onClick={() => openDel(data)}
        className="btn--icon-danger">
        <Trash2 size={14} />
      </Button>
    </div>
  ), [t, openEdit, openDel]);

  const columnDefs = useMemo(() => [
    {
      headerName: t('employees.col_num'),
      valueGetter: 'node.rowIndex + 1',
      width: 60, sortable: false, filter: false,
      cellStyle: { textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600' },
    },
    {
      headerName: t('employees.col_nameAr'), field: 'nameAr', flex: 1.3, minWidth: 140,
      cellRenderer: ({ value, data }) => (
        <div className="manager-cell">
          <span className="manager-avatar">{value?.[0] || '؟'}</span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px' }}>{value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.email}</div>
          </div>
        </div>
      ),
    },
    {
      headerName: t('employees.col_nameEn'), field: 'nameEn', flex: 1.3, minWidth: 140,
      cellStyle: { direction: 'ltr', textAlign: 'left', fontFamily: 'sans-serif' },
    },
    {
      headerName: t('employees.col_dept'), field: 'departmentId', flex: 1.2, minWidth: 130,
      cellRenderer: ({ value }) => (
        <span style={{
          background: '#dbeafe', color: '#1e40af',
          padding: '3px 10px', borderRadius: '6px',
          fontSize: '12px', fontWeight: '600',
        }}>
          {getDeptName(value)}
        </span>
      ),
    },
    { headerName: t('employees.col_jobTitle'), field: 'jobTitle', flex: 1.2, minWidth: 130 },
    {
      headerName: t('employees.col_phone'), field: 'phone', flex: 0.9, minWidth: 120,
      cellStyle: { direction: 'ltr', textAlign: 'left', fontFamily: 'monospace', fontSize: '13px' },
    },
    {
      headerName: t('employees.col_status'), field: 'status', flex: 0.7, minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: ({ value }) => {
        const active = value === 'active';
        return (
          <span style={{
            background: active ? '#dcfce7' : '#fee2e2',
            color:      active ? '#15803d' : '#b91c1c',
            padding: '3px 10px', borderRadius: '6px',
            fontSize: '12px', fontWeight: '700',
          }}>
            {active ? t('employees.status_active') : t('employees.status_inactive')}
          </span>
        );
      },
    },
    {
      headerName: t('employees.col_actions'), field: 'actions',
      width: 90, sortable: false, filter: false,
      cellRenderer: ActionsRenderer,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    },
  ], [t, ActionsRenderer, getDeptName]);

  const defaultColDef = useMemo(() => ({
    sortable: true, filter: true, resizable: true, suppressMovable: true,
  }), []);

  const handleSave = async (formData) => {
    setDialogOpen(false);
    try {
      if (editingEmp) {
        await employeesFullAPI.update(editingEmp.id, formData).catch(() => {});
        setRowData(prev => prev.map(e => e.id === editingEmp.id ? { ...e, ...formData } : e));
        showToast(t('employees.editSuccess'), 'success');
      } else {
        let created = { id: Date.now(), ...formData };
        try { const r = await employeesFullAPI.create(formData); created.id = r.id || created.id; } catch {}
        setRowData(prev => [...prev, created]);
        showToast(t('employees.addSuccess'), 'success');
      }
    } catch {
      showToast(t('employees.error'), 'error');
    }
    setEditingEmp(null);
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await employeesFullAPI.delete(deletingEmp.id).catch(() => {});
      setRowData(prev => prev.filter(e => e.id !== deletingEmp.id));
      showToast(t('employees.deleteSuccess'), 'success');
    } catch {
      showToast(t('employees.error'), 'error');
    }
    setDeletingEmp(null);
  };

  const active   = rowData.filter(e => e.status === 'active').length;
  const inactive = rowData.length - active;

  return (
    <div className="page-dept">

      <div className="page-top">
        <div>
          <h1 className="page-title">{t('employees.title')}</h1>
          <p className="page-sub">{t('employees.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={16} /> {t('employees.addBtn')}
        </Button>
      </div>

      <div className="stats-bar">
        {[
          { value: rowData.length, label: t('employees.totalEmps') },
          { value: active,         label: t('employees.activeEmps') },
          { value: inactive,       label: t('employees.inactiveEmps') },
        ].map(({ value, label }) => (
          <div key={label} className="stat-card">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid-card">
        <div className="ag-theme-alpine dept-grid" style={{ height: 500, width: '100%' }}>
          {loading ? (
            <div className="grid-loading">
              <div className="spinner" />
              <span>{t('employees.loading')}</span>
            </div>
          ) : (
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={8}
              paginationPageSizeSelector={[5, 8, 10, 20]}
              animateRows={true}
              rowHeight={60}
              headerHeight={48}
              enableRtl={true}
              getRowClass={({ node }) => node.rowIndex % 2 === 0 ? 'row-even' : 'row-odd'}
              overlayNoRowsTemplate={`<span class="no-rows">${t('employees.noRows')}</span>`}
            />
          )}
        </div>
      </div>

      <EmployeeDialog
        isOpen={dialogOpen}
        employee={editingEmp}
        departments={departments}
        onSave={handleSave}
        onClose={() => { setDialogOpen(false); setEditingEmp(null); }}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        deptName={deletingEmp?.nameAr}
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingEmp(null); }}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default EmployeesPage;

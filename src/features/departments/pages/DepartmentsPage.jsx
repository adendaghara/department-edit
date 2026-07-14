
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import { Pencil, Trash2, Plus } from 'lucide-react';

import { Button, ConfirmDialog, Toast, useToast } from '../../../shared/index.js';
import { DepartmentDialog } from '../components/DepartmentDialog.jsx';
import { departmentsAPI, mockDepartments, employeesFullAPI, mockEmployees } from '../../../api.js';
import '../../../styles/departments.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


export function DepartmentsPage() {
  const { t }    = useTranslation();
  const gridRef  = useRef(null);
  const { toast, show: showToast } = useToast();

  const [rowData, setRowData]           = useState([]);
  const [employees, setEmployees]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editingDept, setEditingDept]   = useState(null);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const [depts, emps] = await Promise.all([
        departmentsAPI.getAll(),
        employeesFullAPI.getAll(),
      ]);
      setRowData(Array.isArray(depts) ? depts : depts.data || []);
      setEmployees(Array.isArray(emps) ? emps : emps.data || []);
    } catch {
      setRowData(mockDepartments);
      setEmployees(mockEmployees);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const openAdd  = useCallback(() => { setEditingDept(null); setDialogOpen(true); }, []);
  const openEdit = useCallback((data) => { setEditingDept(data); setDialogOpen(true); }, []);
  const openDel  = useCallback((data) => { setDeletingDept(data); setConfirmOpen(true); }, []);

  const ActionsRenderer = useCallback(({ data }) => (
    <div className="actions-cell">
      <Button variant="icon" size="sm" title={t('departments.edit')}   onClick={() => openEdit(data)}>
        <Pencil size={14} />
      </Button>
      <Button variant="icon" size="sm" title={t('departments.delete')} onClick={() => openDel(data)}
        className="btn--icon-danger">
        <Trash2 size={14} />
      </Button>
    </div>
  ), [t, openEdit, openDel]);

  const columnDefs = useMemo(() => [
    {
      headerName: t('departments.col_num'),
      valueGetter: 'node.rowIndex + 1',
      width: 60, sortable: false, filter: false,
      cellStyle: { textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600' },
    },
    { headerName: t('departments.col_nameAr'), field: 'nameAr', flex: 1.5, minWidth: 150 },
    {
      headerName: t('departments.col_nameEn'), field: 'nameEn', flex: 1.5, minWidth: 170,
      cellStyle: { fontFamily: 'sans-serif', direction: 'ltr', textAlign: 'left' },
    },
    {
      headerName: t('departments.col_manager'), field: 'manager', flex: 1.2, minWidth: 140,
      cellRenderer: ({ value }) => (
        <div className="manager-cell">
          <span className="manager-avatar">{value?.[0] || '؟'}</span>
          {value}
        </div>
      ),
    },
    {
      headerName: t('departments.col_empCount'), field: 'employeeCount', flex: 0.7, minWidth: 100,
      cellStyle: { textAlign: 'center' },
      cellRenderer: ({ value }) => (
        <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary)' }}>
          {value ?? 0}
        </span>
      ),
    },
    {
      headerName: t('departments.col_achievement'), field: 'achievement', flex: 1, minWidth: 130,
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: ({ value }) => {
        const val = value ?? 0;
        const [bg, color] =
          val < 50  ? ['#f1d0d0', '#8b3a3a'] :
          val === 50 ? ['#f0e4c4', '#7a5c1e'] :
                       ['#c8dff0', '#1a4b8c'];
        return (
          <span style={{
            background: bg, color, fontWeight: '700', fontSize: '13px',
            padding: '4px 14px', borderRadius: '8px',
            minWidth: '52px', textAlign: 'center', display: 'inline-block',
          }}>
            {val}%
          </span>
        );
      },
    },
    {
      headerName: t('departments.col_actions'), field: 'actions',
      width: 90, sortable: false, filter: false,
      cellRenderer: ActionsRenderer,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    },
  ], [t, ActionsRenderer]);

  const defaultColDef = useMemo(() => ({
    sortable: true, filter: true, resizable: true, suppressMovable: true,
  }), []);

  const handleSave = async (formData) => {
    setDialogOpen(false);
    try {
      if (editingDept) {
        await departmentsAPI.update(editingDept.id, formData).catch(() => {});
        setRowData(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...formData } : d));
        showToast(t('toast.editSuccess'), 'success');
      } else {
        let created = { id: Date.now(), employeeCount: 0, achievement: 0, ...formData };
        try { const r = await departmentsAPI.create(formData); created.id = r.id || created.id; } catch {}
        setRowData(prev => [...prev, created]);
        showToast(t('toast.addSuccess'), 'success');
      }
    } catch {
      showToast(t('toast.error'), 'error');
    }
    setEditingDept(null);
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await departmentsAPI.delete(deletingDept.id).catch(() => {});
      setRowData(prev => prev.filter(d => d.id !== deletingDept.id));
      showToast(t('toast.deleteSuccess'), 'success');
    } catch {
      showToast(t('toast.deleteError'), 'error');
    }
    setDeletingDept(null);
  };

  const totalEmps = rowData.reduce((s, d) => s + (d.employeeCount || 0), 0);
  const avgEmps   = rowData.length ? Math.round(totalEmps / rowData.length) : 0;

  return (
    <div className="page-dept">

      <div className="page-top">
        <div>
          <h1 className="page-title">{t('departments.title')}</h1>
          <p className="page-sub">{t('departments.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={16} /> {t('departments.addBtn')}
        </Button>
      </div>

      <div className="stats-bar">
        {[
          { value: rowData.length, label: t('departments.totalDepts') },
          { value: totalEmps,      label: t('departments.totalEmps') },
          { value: avgEmps,        label: t('departments.avgEmps') },
        ].map(({ value, label }) => (
          <div key={label} className="stat-card">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid-card">
        <div className="ag-theme-alpine dept-grid" style={{ height: 480, width: '100%' }}>
          {loading ? (
            <div className="grid-loading">
              <div className="spinner" />
              <span>{t('departments.loading')}</span>
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
              rowHeight={56}
              headerHeight={48}
              enableRtl={true}
              getRowClass={({ node }) => node.rowIndex % 2 === 0 ? 'row-even' : 'row-odd'}
              overlayNoRowsTemplate={`<span class="no-rows">${t('departments.noRows')}</span>`}
            />
          )}
        </div>
      </div>

      <DepartmentDialog
        isOpen={dialogOpen}
        employees={employees}
        dept={editingDept}
        onSave={handleSave}
        onClose={() => { setDialogOpen(false); setEditingDept(null); }}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        deptName={deletingDept?.nameAr}
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingDept(null); }}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default DepartmentsPage;

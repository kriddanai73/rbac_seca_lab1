import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const TableInput = ({ title, items, columns, onChange, onAdd, onRemove }) => {
  return (
    <div className="form-section">
      {title && <h3 className="section-title">{title}</h3>}
      <div className="table-container">
        <table className="form-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{width: col.width || 'auto'}}>{col.label}</th>
              ))}
              <th style={{width: '50px'}}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type={col.type || 'text'}
                      className="form-input"
                      value={item[col.name] || ''}
                      onChange={(e) => onChange(rowIndex, col.name, e.target.value)}
                      placeholder={col.placeholder || ''}
                      disabled={col.disabled}
                    />
                  </td>
                ))}
                <td style={{textAlign: 'center'}}>
                  <button 
                    type="button" 
                    onClick={() => onRemove(rowIndex)}
                    className="table-action-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button 
          type="button" 
          onClick={onAdd}
          className="btn btn-outline table-add-btn"
        >
          <Plus size={14} /> เพิ่มรายการ
        </button>
      </div>
    </div>
  );
};

export default TableInput;

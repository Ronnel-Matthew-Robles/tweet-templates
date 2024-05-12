import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import TemplateModal from './template_modal';

export function TemplateTable({ columns, data }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    } = useTable({ columns, data }, useSortBy);

    const handleRowClick = template => {
        setSelectedTemplate(template);
        setModalIsOpen(true);
      };

    return (
        <div className='table-responsive'>
        <table {...getTableProps()} className='table table-striped table-hover'>
            <thead className='thead-dark'>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                        {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                    </span>
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
                    {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                </tr>
                );
            })}
            </tbody>
        </table>
        {selectedTemplate && (
            <TemplateModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            template={selectedTemplate}
            />
        )}
        </div>
    );
}

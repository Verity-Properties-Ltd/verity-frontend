import type { ExtractedField } from '@dev/lib/types/property';

export function ExtractedFieldsTable({ fields }: { fields: ExtractedField[] }) {
  return (
    <table className="dv-fields-table">
      <thead>
        <tr>
          <th scope="col">Field</th>
          <th scope="col">Value</th>
          <th scope="col" className="dv-conf-col">Confidence</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((f) => (
          <tr key={f.field}>
            <td className="field">{f.field}</td>
            <td className="value">{f.value}</td>
            <td className="dv-conf-col">
              <span className={`dv-conf-pill tone-${f.confidence}`}>{f.confidence}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

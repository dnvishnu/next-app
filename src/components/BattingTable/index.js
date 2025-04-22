function createData(name, Desc, Runs, Balls, fours, sixs, SR, Team, innings) {
  return { name, Desc, Runs, Balls, fours, sixs, SR, Team, innings };
}

export default function BattingTable({ data, team, teamNum }) {
  const rows = data.map((item) => createData(...item));

  const totalRunsRow = rows
    .filter((row) => row.Team === teamNum)
    .find((row) => row.name === "TOTAL" || row.name === "Total");

  const totalRuns = totalRunsRow ? totalRunsRow.SR : 0;

  const renderCell = (row, field, isTotalRow) => {
    if (isTotalRow) {
      return field === "Runs" ? row.SR : "";
    }
    return row[field];
  };

  return (
    <>
      <div className="sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between bg-gray-500 text-white py-3 px-4 rounded-none lg:rounded-sm">
          <span className="text-lg font-semibold">{team} Innings</span>
          <span className="text-lg font-semibold">Score: {totalRuns}</span>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 ">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Batter
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                    >
                      Desc
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-center text-sm font-semibold text-gray-900"
                    >
                      Runs
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-center text-sm font-semibold text-gray-900"
                    >
                      Balls
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-center text-sm font-semibold text-gray-900"
                    >
                      4s
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-center text-sm font-semibold text-gray-900"
                    >
                      6s
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-4 text-center text-sm font-semibold text-gray-900"
                    >
                      SR
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rows
                    .filter((row) => row.Team === teamNum)
                    .map((row, index) => {
                      const isTotalRow =
                        row.name === "TOTAL" || row.name === "Total";

                      return (
                        <tr key={index}>
                          <td
                            className={`whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium ${
                              isTotalRow
                                ? "text-black font-bold"
                                : "text-blue-600"
                            } sm:pl-0`}
                          >
                            {row.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                            {row.Desc}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm font-semibold text-gray-900 text-center">
                            {renderCell(row, "Runs", isTotalRow)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
                            {renderCell(row, "Balls", isTotalRow)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
                            {renderCell(row, "fours", isTotalRow)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
                            {renderCell(row, "sixs", isTotalRow)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
                            {renderCell(row, "SR", isTotalRow)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

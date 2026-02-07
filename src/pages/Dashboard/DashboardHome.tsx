const Dashboard = () => {
  return (
    <div className="p-6">
      456
      <h1 className="text-2xl font-bold mb-4">📊 儀表板</h1>
      {/* <div
        className="
      fixed inset-0 m-auto bg-black w-[200px] h-[200px]"
      >
        <p
          className="bg-red-500 absolute top-[50%] left-[50%]
        transform -translate-x-1/2 -translate-y-1/2
        "
        >
          button
        </p>
      </div> */}
      {/* 🚀 總覽 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">🔹 專案數量: 5</div>
        <div className="bg-green-500 text-white p-4 rounded">
          📌 進行中任務: 12
        </div>
        <div className="bg-red-500 text-white p-4 rounded">⚠️ 近期截止: 3</div>
      </div>
      {/* 📋 進行中的專案 */}
      <h2 className="text-xl font-bold mt-6">📌 進行中的專案</h2>
      <ul className="mt-2 space-y-2 ">
        <li className="p-3 bg-gray-200 rounded cursor-pointer">專案 A</li>
        <li className="p-3 bg-gray-200 rounded cursor-pointer">專案 B</li>
      </ul>
      {/* ✅ 最近完成的任務 */}
      <h2 className="text-xl font-bold mt-6">✅ 最近完成的任務</h2>
      <ul className="mt-2 space-y-2">
        <li className="p-3 bg-gray-100 rounded">✔️ 任務 A</li>
        <li className="p-3 bg-gray-100 rounded">✔️ 任務 B</li>
      </ul>
    </div>
  );
};

export default Dashboard;

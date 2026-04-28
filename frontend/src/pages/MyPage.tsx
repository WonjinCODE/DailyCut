import React, { useEffect, useState } from 'react';
import { getMyPageInfo } from '../services/apiService';
// 예: import { getMyPageInfo, MyPageData } from '../api/apiService';

const MyPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // 타입은 우선 any로 둡니다
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 백엔드에서 데이터 가져오기
        const data = await getMyPageInfo(); 
        setUserData(data);
      } catch (error) {
        console.error(error);
        alert('정보를 불러오지 못했습니다. 다시 로그인 해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-10">데이터가 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">마이페이지</h1>

      {/* 1. 내 프로필 영역 */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">👤 내 프로필</h2>
        <div className="space-y-2 text-gray-600">
          <p><span className="font-medium w-20 inline-block">닉네임:</span> {userData.nickname}</p>
          <p><span className="font-medium w-20 inline-block">이메일:</span> {userData.email}</p>
        </div>
      </section>

      {/* 2. 나의 OTT 설정 영역 */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📺 나의 OTT 설정</h2>
        <div className="flex gap-2">
          {userData.subscribedOtts?.length > 0 ? (
            userData.subscribedOtts.map((ott: string) => (
              <span key={ott} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {ott}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">설정된 OTT가 없습니다.</p>
          )}
        </div>
      </section>

      {/* 3. 선호 장르 설정 영역 */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🎭 선호 장르 (1~3순위)</h2>
        <div className="flex gap-2">
          {userData.preferredGenres?.length > 0 ? (
            userData.preferredGenres.map((genre: string, index: number) => (
              <span key={genre} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {index + 1}순위: {genre}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">설정된 장르가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyPage;
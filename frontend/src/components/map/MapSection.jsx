import { useEffect, useRef } from 'react';
import { useAlert } from '@/hooks/useAlert';
import '@styles/MapSection.css';

const MapSection = () => {
  const mapRef = useRef(null);
  const showAlert = useAlert();
  const lat = 37.52774918798905;
  const lng = 126.89613398474555;

  useEffect(() => {
    const { naver } = window;
    if (mapRef.current && naver) {
      const location = new naver.maps.LatLng(lat, lng);
      const map = new naver.maps.Map(mapRef.current, {
        center: location,
        zoom: 17,
      });
      new naver.maps.Marker({
        position: location,
        map,
      });
    }
  }, []);

  const handleCopy = (text, message) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showAlert({
          message: `주소가 복사되었습니다!`,
          type: 'default',
          closeOnOverlayClick: true,
        });
      })
      .catch((err) => {
        console.error('복사 실패', err);
      });
  };

  return (
    <section className="map-section-dark">
      <header className="map-header">
        <h2 className="location-title">LOCATION</h2>
        <p className="location-subtitle">오시는 길</p>
      </header>

      <div className="map-wrapper">
        <div ref={mapRef} className="map-section"></div>
      </div>

      <div className="transport-list">
        <div className="transport-item">
          <div className="label">지하철</div>
          <div className="info">
            2호선, 5호선 영등포구청역 3번 출구
            <br />
            도보 2분 거리
          </div>
        </div>

        <div className="transport-item">
          <div className="label">버스</div>
          <div className="info">당산동 삼익아파트 도보 1분 거리</div>
        </div>

        <div className="transport-item">
          <div className="label">자가용</div>
          <div className="info">무료 주차 2시간</div>
        </div>

        <div className="transport-item">
          <div className="label">주소</div>
          <div className="transport-info-section">
            <div className="info">
              서울특별시 영등포구 국회대로 558
              <br />
              02-6297-7000
            </div>
            <div className="copy-btn">
              <button onClick={handleCopy}>복사하기</button>
            </div>
          </div>
        </div>
      </div>

      <div className="map-app-buttons">
        <button
          onClick={() =>
            window.open(
              'https://map.naver.com/p/directions/-/14126011.918452,4512925.4832867,%EC%9B%A8%EC%8A%A4%ED%84%B4%EB%B2%A0%EB%8B%88%EB%B9%84%EC%8A%A4%20%EC%98%81%EB%93%B1%ED%8F%AC,1462458894,PLACE_POI/-/car?c=15.00,0,0,0,dh',
              '_blank',
            )
          }
        >
          네이버 지도
        </button>
        <button
          onClick={() =>
            window.open(
              'https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=%2C%2C477048%2C1118973&rt1=&rt2=%EC%98%81%EB%93%B1%ED%8F%AC%EC%9B%A8%EC%8A%A4%ED%84%B4%EB%B2%A0%EB%8B%88%EB%B9%84%EC%8A%A4&rtIds=%2C&rtTypes=%2C',
            )
          }
        >
          카카오맵
        </button>
        <button
          onClick={() =>
            window.open(
              'https://map.kakao.com/link/to/웨스턴베니비스영등포,37.52774918798905,126.89613398474555',
            )
          }
        >
          티맵
        </button>
      </div>
    </section>
  );
};

export default MapSection;

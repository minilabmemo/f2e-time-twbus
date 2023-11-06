import {

  LinkNames,
  Dict,
  URI_NEARBY_DEFAULT,
  URI_SEARCH_DEFAULT,
  URI_SAVE_DEFAULT,

  calculateStopsURL,
  StorageKey,
  URI_PET_FIND_PREFIX,
  ActionType,
  itemI,
  keyboardRouteList,
  LangType,
  StatusColorType,
  statusDefine,
} from './const';

describe('常數與物件', () => {


  it('LinkNames 和 Dict 應該包含特定語言的名稱', () => {
    expect(LinkNames.nearby).toHaveProperty('zh');
    expect(LinkNames.nearby).toHaveProperty('en');
    expect(Dict.home).toHaveProperty('zh');
    expect(Dict.home).toHaveProperty('en');
  });

  it('URI_NEARBY_DEFAULT、URI_SEARCH_DEFAULT 和 URI_SAVE_DEFAULT 應該包含預設值', () => {
    expect(URI_NEARBY_DEFAULT).toEqual('nearby');
    expect(URI_SEARCH_DEFAULT).toEqual('cities');
    expect(URI_SAVE_DEFAULT).toEqual('save/:lang');
  });

  it('calculateStopsURL 函數應該回傳正確的 URL', () => {
    const url = calculateStopsURL({ lang: 'en', city: 'city1', route: 'route1' });
    expect(url).toEqual('/en/city1/route1');
  });

  it('StorageKey 應該等於 "savedAnimalIDs"', () => {
    expect(StorageKey).toEqual('savedAnimalIDs');
  });

  it('URI_PET_FIND_PREFIX 應該包含 "find-pet"', () => {
    expect(URI_PET_FIND_PREFIX).toEqual('find-pet');
  });

  it('ActionType 枚舉應該包含 "delete" 和 "clear"', () => {
    expect(ActionType.delete).toEqual('delete');
    expect(ActionType.clear).toEqual('clear');
  });

  it('keyboardRouteList 陣列應該包含指定的物件屬性', () => {
    const sampleItem: itemI = { zh: '紅', attr: 'btn btn-red' };
    expect(keyboardRouteList).toContainEqual(sampleItem);
  });

  it('LangType 和 StatusColorType 枚舉應該包含特定值', () => {
    expect(LangType.zh).toEqual('zh');
    expect(LangType.en).toEqual('en');
    expect(StatusColorType.red).toEqual('red');
    expect(StatusColorType.blue).toEqual('blue');
    expect(StatusColorType.gray).toEqual('gray');
  });
});

describe('statusDefine 函數', () => {
  it('應該正確回傳狀態與顏色', () => {
    const status1 = statusDefine(1, null);
    expect(status1[0]).toEqual('尚未發車');
    expect(status1[1]).toEqual(StatusColorType.gray);

    const status2 = statusDefine(0, 30);
    expect(status2[0]).toEqual('進站中');
    expect(status2[1]).toEqual(StatusColorType.red);

    const status3 = statusDefine(2, 30);
    expect(status3[0]).toEqual('交管不停靠');
    expect(status3[1]).toEqual(StatusColorType.gray);

    const status4 = statusDefine(3, 30);
    expect(status4[0]).toEqual('末班車已過');
    expect(status4[1]).toEqual(StatusColorType.gray);

    const status5 = statusDefine(4, 30);
    expect(status5[0]).toEqual('今日未營運');
    expect(status5[1]).toEqual(StatusColorType.gray);

    const status6 = statusDefine(0, null);
    expect(status6[0]).toEqual('無資訊');
    expect(status6[1]).toEqual(StatusColorType.gray);

    const status7 = statusDefine(0, 100);
    expect(status7[0]).toEqual('即將進站');
    expect(status7[1]).toEqual(StatusColorType.red);

    const status8 = statusDefine(0, 125);
    expect(status8[0]).toEqual('2分5秒');
    expect(status8[1]).toEqual(StatusColorType.blue);

    const status9 = statusDefine(0, 3610);
    expect(status9[0]).toEqual('1小時0分10秒');
    expect(status9[1]).toEqual(StatusColorType.blue);

    const status10 = statusDefine(6, "not number");
    expect(status10[0]).toEqual('未知');
    expect(status10[1]).toEqual(StatusColorType.gray);

  });
});
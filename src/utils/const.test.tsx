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
} from './const'; // 請替換為你的模組路徑

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

    const status2 = statusDefine(2, 30);
    expect(status2[0]).toEqual('進站中');
    expect(status2[1]).toEqual(StatusColorType.red);

  });
});
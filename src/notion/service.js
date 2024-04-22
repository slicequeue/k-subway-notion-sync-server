const config = require('../config');
const { notion } = require('./client');

const defaultDatabaseId = config.notion.databaseId;

const getDatabaseAllPages = async (databaseId = defaultDatabaseId) => {
  const pages = [];
  let cursor = undefined;

  while (true) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    pages.push(...response.results);

    if (!response.has_more) {
      break;
    }

    cursor = response.next_cursor;
  }
  return pages;
}

const archivePages = async (pages) => {
  const archivePromises = pages.map(page => {
    return notion.pages.update({
      page_id: page.id,
      archived: true,
    });
  });

  await Promise.all(archivePromises);
  console.log('모든 페이지가 아카이브 처리되었습니다.');
}

// 모든 글 삭제(아카이빙) 처리
async function clearDatabaseAllPages(databaseId = defaultDatabaseId) {
  const allPages = await getDatabaseAllPages(databaseId);
  await archivePages(allPages);
}


const createDatabasePage = async ({
  databaseId=defaultDatabaseId, properties
}) => {
  return await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
}

// 복수개 글 생성 처리
async function createDatabaseAllPages({databaseId = defaultDatabaseId, dataList, mapper}) {
  let pagePropertiesList = typeof(mapper) === 'function' ? dataList.map(each => mapper(each)) : dataList;

  const pageCreationPromises = pagePropertiesList.map(pageData => {
    return createDatabasePage({databaseId, properties: pageData});
  });

  const res = await Promise.all(pageCreationPromises);
  console.log(`모든 페이지 생성 완료: ${res.length} 개`);
}


module.exports = {
  createDatabaseAllPages,
  clearDatabaseAllPages,
}

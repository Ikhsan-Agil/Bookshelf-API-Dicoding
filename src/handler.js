const {books} = require('./books');
const {nanoid} = require('nanoid');

const addHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} =
    request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      /* eslint max-len: ["error", { "ignoreStrings": true }]*/
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    const books = books.filter((bk) => bk.name.toLowerCase() === name);
    return {
      status: 'success',
      data: {
        books: books.map((nl) => ({
          name: nl.name,
          publisher: nl.publisher,
        })),
      },
    };
  } else if (reading !== undefined) {
    if (reading === 0) {
      const books = books.filter((bk) => bk.reading === false);
      return {
        status: 'success',
        data: {
          books: books.map((rd) => ({
            name: rd.name,
            publisher: rd.publisher,
          })),
        },
      };
    }
    const books = books.filter((bk) => bk.reading === true);
    return {
      status: 'success',
      data: {
        books: books.map((rd) => ({
          name: rd.name,
          publisher: rd.publisher,
        })),
      },
    };
  } else if (finished !== undefined) {
    if (finished === 0) {
      const books = books.filter((bk) => bk.finished === false);
      return {
        status: 'success',
        data: {
          books: books.map((fn) => ({
            name: fn.name,
            publisher: fn.publisher,
          })),
        },
      };
    }
    const books = books.filter((bk) => bk.reading === true);
    return {
      status: 'success',
      data: {
        books: books.map((fn) => ({
          name: fn.name,
          publisher: fn.publisher,
        })),
      },
    };
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getSpecificHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((bk) => bk.id === bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  return {
    status: 'success',
    data: {
      book,
    },
  };
};

const editHandler = (request, h) => {
  const {bookId} = request.params;
  const {name, year, author, summary, publisher, pageCount, readPage, reading} =
    request.payload;
  // eslint-disable-next-line new-cap
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((bk) => bk.id === bookId);
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((bk) => bk.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  return {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };
};

module.exports = {
  addHandler,
  getAllHandler,
  getSpecificHandler,
  editHandler,
  deleteHandler,
};

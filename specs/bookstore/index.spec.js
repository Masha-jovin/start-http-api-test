import axios from "axios";
import { jest } from "@jest/globals"; 
import expect from "expect"; jest;
import supertest from "supertest";    
import account from '../../framework/services/account.services';
import bookstore from '../../framework/services/bookstore.services';  // редачить
import config from '../../framework/config'



let userID=''
let token=''
let isbn=config.isbns[0]
let isbnNew=config.isbns[1] //  вторая книга
let collection=[]
let resultsCode=0

// это надо оставить, возможно как просто функцию, без test и expect
	describe('0. PreProcessor. Создание пользователя POST /Account/v1/User', () => {
	test('Регистрация должна проходить успешно с правильным логином и паролем', async () => {	  
      const res = await account.createAccount(config.credentials)	
	  token = await account.getAuthToken()
	  userID = res.body.userID	  
	  console.log('0. res Создание юзера',res.text)
	  console.log('0. token',token)
      expect(res.status).toEqual(201);
    })
  })

	
describe('BookStore', () => {
	/*  не хочет работать
  describe('0. Получение списка книг GET /BookStore/v1/Books', () => {
	test('получение', async () => {
	  const res = await bookstore.getAllBooks()	 
	  //isbn = res.data.books[0].isbn
	  console.log('0. res Создание книги',res.text)			// для красоты
	  //console.log('0. isbn',isbn)
	  //console.log('0. resn',res)
      expect(res.status).toEqual(200);      
    })	
  })
  */
	
	
	
  describe('1. Создание книги POST /BookStore/v1/Books', () => {
	test('Успешное создание', async () => {
	  const res = await bookstore.createBook(userID,token,isbn)	 
	  console.log('1. res Создание книги',res.text)			// для красоты
      expect(res.status).toEqual(201);      
    })
	
	test('Успешное создание пачки книг', async () => {
		collection=await bookstore.createCollections(config.isbns) // создаем коллекцию книг для загрузки
		console.log('1. collection',collection)
		const res = await bookstore.createBookList(userID,token,collection)	 
		console.log('1. res Создание пачки книг',res.text)			// для красоты
		expect(res.status).toEqual(201);      
    })
	
  })
		

	
  describe('2. Обновление книги PUT /BookStore/v1/Books', () => {
	test('Успешное обновление', async () => {
	  const res = await bookstore.putBook(userID,token,isbn,isbnNew)	 
	  console.log('2. res Обновление книги',res.text)			// для красоты
      expect(res.status).toEqual(200);      
    })

  })
	
	
  describe('3. Получении информации о книге GET /BookStore/v1/Books', () => {
	test('Успешное получение инфо', async () => {
	  const res = await bookstore.getBook(isbnNew)	 
	  //console.log('2. res',res)  // отсюда извлечь бы ответ красиво
	  console.log('2. res Получение инфо',res.text)			// для красоты
      expect(res.status).toEqual(200);      
    })

  })
	
	
	
	
	
  describe('4. Удаление книги DELETE /BookStore/v1/Book', () => {
	test('Успешное удаление книги', async () => {	  
      const res = await bookstore.deleteBook(userID,token,isbnNew)	 
	  console.log('4. res Удаление книги',res.text)	    // для красоты
      expect(res.status).toEqual(204);	 
    }),
	// сюда накидать тестов на ручку
	
	test.each`
		isbnNew | resultsCode				
		${config.isbns[2]} | ${204}
		${config.isbns[3]} | ${204}
		${0} | ${400}
		`('Удаление книги: при isbn=$isbnNew возвращается $resultsCode', async ({isbnNew,resultsCode}) => {	  
      const res = await bookstore.deleteBook(userID,token,isbnNew)	 
	  //console.log('4. res Удаление книги',res)
	  console.log('4. isbnNew',isbnNew)
	  console.log('4. resultsCode',resultsCode)
	  console.log('4. res Удаление книги',res.text)	    // для красоты
      expect(res.status).toEqual(resultsCode);	 
    })
	
	
		/* это не работает((( userID и token не подтягиваются
		test.each`
		userIDt | tokent | isbnNewt | resultsCode				
		${'uncorrectUserID'} | ${this.token} | ${config.isbns[2]} | ${401}
		${this.userID} | ${'uncorrectToken'} | ${config.isbns[3]} | ${401}
		${this.userID} | ${this.token} | ${config.isbns[9]} | ${400}
		`('Неуспешное удаление: при $userIDt, $tokent, $isbnNewt возвращается $resultsCode', async ({userIDt,tokent,isbnNewt,resultsCode}) => {	  
      const res = await bookstore.deleteBook(userIDt,tokent,isbnNewt)	 
	  console.log('4. res Удаление книги',res.text)	    // для красоты
      expect(res.status).toEqual(resultsCode);	 
    })
	*/
		
	
  })
  
})
	
	
	
	
	
	
	
// это надо оставить, возможно как просто функцию, без test и expect
  describe('N. PostProcessor. Удаление пользователя DELETE /Account/v1/User/{UUID}', () => {	
	test('Успешное удаление юзера с правильным логином, паролем и userID', async () => {	      
	  const res = await account.deleteAccount(userID,token)	 	  
	  console.log('N. res Удаление юзера',res.text)	// для красоты
      expect(res.status).toEqual(204);	 
    })	
  })
	

	    


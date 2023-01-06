import axios from "axios";
import { jest } from "@jest/globals"; 
import expect from "expect"; jest;
import supertest from "supertest";    
import account from '../helper/account';
import config from '../config'



let userID=''
let token=''

describe('Account', () => {
	describe('0. Создание пользователя POST /Account/v1/User', () => {
	test('Регистрация должна проходить успешно с правильным логином и паролем', async () => {	  
      const res = await account.createAccount(config.credentials)	
	  userID = res.body.userID	  
	  console.log('0. res',res.text)
      expect(res.status).toEqual(201);
    })
  })
	
	
	
  describe('1. Авторизация POST /Account/v1/Authorized', () => {
	test('Неуспешная авторизация (false) с правильным логином и паролем, и неправильным токеном', async () => {	  
      const res = await account.authLoginPass(config.credentials,'anyToken')	 	  
      expect(res.status).toEqual(200);
      expect(res.text).toEqual('false');
    })
	test('Неуспешная авторизация (404) с неправильным логином/паролем и правильным токеном', async () => {
	  token = await account.getAuthToken()
      const res = await account.authLoginPass({userName: 'testLogin20',	password:'1testPass%123456789'},token)	 	  
      expect(res.status).toEqual(404);
      expect(res.text).toEqual('{"code":"1207","message":"User not found!"}');
    })
	test('Неуспешная авторизация (400) при отсутствии обязательного параметра в body', async () => {
	  token = await account.getAuthToken()
      const res = await account.authLoginPass({userName: 'testLogin20'},token)	 	  
      expect(res.status).toEqual(400);
      expect(res.text).toEqual('{"code":"1200","message":"UserName and Password required."}');
    })
	test('Успешная авторизация (true) с правильным логином, паролем и токеном', async () => {
      const res = await account.authLoginPass(config.credentials,token)	 
	  console.log('1. res',res.text)			// для красоты
      expect(res.status).toEqual(200);
      expect(res.text).toEqual('true');
    })
	
  })
	
	
  describe('2. Получение информации о пользователе GET /Account/v1/User/{UUID}', () => {
	test('Успешное получение инфо с правильным токеном и userID', async () => {	  
      const res = await account.getInfo(userID,token)	 
	  console.log('2. res',res.text)	// для красоты
      expect(res.status).toEqual(200);	 
    })
	test('Неуспешное получение инфо с неправильным токеном к userID ', async () => {	  
      const res = await account.getInfo(userID,'anyToken')	 
      expect(res.status).toEqual(401);	 
	  expect(res.text).toEqual('{"code":"1200","message":"User not authorized!"}')
    })
	test('Неуспешное получение инфо для несуществующего userID ', async () => {	  
      const res = await account.getInfo('anyUserID',token)	 
      expect(res.status).toEqual(401);
	  expect(res.text).toEqual('{"code":"1207","message":"User not found!"}')	  
    })
  })
	
	
  describe('3. Удаление пользователя DELETE /Account/v1/User/{UUID}', () => {	
	test('Неуспешное удаление юзера с несуществующим userID', async () => {		  
      const res = await account.deleteAccount('anyUserID',token)	 	  
      expect(res.status).toEqual(200);	 
	  expect(res.text).toEqual('{"code":"1207","message":"User Id not correct!"}')
    })
	test('Неуспешное удаление юзера с неправильным токеном', async () => {		  
      const res = await account.deleteAccount(userID,'anyToken')	 	  
      expect(res.status).toEqual(401);	 
	  expect(res.text).toEqual('{"code":"1200","message":"User not authorized!"}')
    })
	test('Успешное удаление юзера с правильным логином, паролем и userID', async () => {		  
      const res = await account.deleteAccount(userID,token)	 	  
      expect(res.status).toEqual(204);	 
    })	
  })
	

	    
})

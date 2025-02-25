/* eslint-env mocha */
const app = require('../app.js');
const { use, expect } = require('chai');
const chaiHttp = require('chai-http');

const chai = use(chaiHttp);

//Mocks:

const newItems = require('./mocks/newItems.json');

/*
NOTA: Esta API es experimental, tiene fines de mostrar mi conocimiento y esta documentada con swagger, por
        ende este test es simple y demostrativo.
        Para un test real debe ser mucho mas extenso y detallado.

      Tambien otro uso mas eficiente seria crear dentro de la carpeta un archivo de testing para cada router
      o para cada alineamiento de testing que se quiera realizar.
*/

describe('API Tests', () => {
  let token;
  //LOGIN - 200
  it("Se envia las credenciales para loguear en una cuenta y se recupera el TOKEN", (done) => {
    chai.request(app)
      .post('/users/login')
      .send({ email: 'ferreteriagonzalez@gmail.com', password: 'ferreteriagonzalez123' })
      .end((err, res) => {
        if (err) {
          console.error('Error en /users/login - ', err);
          return done(err);
        }
        try{
          token = res.body.token; // Guardo el token para usarlo en los siguientes tests
          expect(res).to.have.status(200);
          done();
        } catch(err){
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });   
  });
  //CREATE INVENTORY - 200
  it('Se utiliza el TOKEN recuperado y se crea un inventario', (done) => {
    chai.request(app)
      .post('/client/newInventory')
      .set('Authorization', `Bearer ${token}`) 
      .send({ email: 'ferreteriagonzalez@gmail.com', name: 'inventario_general' })
      .end((err, res) => {
        if (err) {
          console.error('Error en /client/newInventory - ', err);
          return done(err);
        }
        try{
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        } catch {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });
  //CREATE PRODUCTS - 200
  it('Se crea un producto en el nuevo inventario', (done) => {
    chai.request(app)
      .post('/client/addItems')
      .set('Authorization', `Bearer ${token}`) 
      .send({ email: 'ferreteriagonzalez@gmail.com', inventoryName: 'inventario_general', list: newItems })
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud:', err);
          return done(err);
        }
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Producto registrado con éxito');
          done();
        } catch (err) {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });
  //GET INVENTORYS - 200
  it('Se obtiene la lista de inventarios', (done) => {
    chai.request(app)
      .post('/client/getInventorys')
      .set('Authorization', `Bearer ${token}`) 
      .send({ email: 'ferreteriagonzalez@gmail.com' })
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud:', err);
          return done(err);
        }
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('inventory');
          done();
        } catch (err) {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });
  //GET INVENTORYS - 401
  it('No se envia el token para que no autorice la petición', (done) => {
    chai.request(app)
      .post('/client/getInventorys')
      .send({ email: 'ferreteriagonzalez@gmail.com' })
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud:', err);
          return done(err);
        }
        try {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          done();
        } catch (err) {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });
  //DELETE INVENTORY - 200
  it('Se elimina el inventario creado', (done) => {
    chai.request(app)
      .delete('/client/deleteInventory')
      .set('Authorization', `Bearer ${token}`) 
      .send({ email: 'ferreteriagonzalez@gmail.com', name: 'inventario_general' })
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud:', err);
          return done(err);
        }
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Inventario eliminado con éxito');
          done();
        } catch (err) {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });
  
});

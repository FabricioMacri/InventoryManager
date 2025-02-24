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

  it('Se crea un producto en el nuevo inventario', (done) => {
    chai.request(app)
      .post('/client/newProduct')
      .set('Authorization', `Bearer ${token}`) 
      .send({ email: 'ferreteriagonzalez@gmail.com', name: 'inventario_general', list: newItems })
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud:', err);
          return done(err);
        }
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Acceso autorizado');
          done();
        } catch (err) {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });
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
          expect(res.body).to.have.property('inventorys');
          done();
        } catch (err) {
          console.error('Error en las expectativas:', err);
          done(err);
        }
      });
  });

  it('Se pide la lista de inventarios pero sin el token para que no nos autorice', (done) => {
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

  it('Se pide la lista de inventarios pero sin el token para que no nos autorice', (done) => {
    chai.request(app)
      .post('/client/deleteInventory')
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

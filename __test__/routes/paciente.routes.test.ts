import request from 'supertest';
import express from 'express';
import pacienteRoutes from '../../src/routes/paciente.routes';
import pacienteService from '../../src/services/paciente.services';

const app = express();
app.use(express.json());
app.use('/api/pacientes',pacienteRoutes)


// Mockear el servicio de paciente
jest.mock('../../src/services/paciente.services');


describe('Paciente Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/pacientes', () => {
        it('should get all pacientes', async () => {
            const mockPacientes = [
                { id: 1, nombre: 'Juan', apellido: 'Pérez', cedula: '12345678', fechaNacimiento: '1990-01-01', telefono: '98765432' },
            ];
            
            (pacienteService.getPacientes as jest.Mock).mockResolvedValue(mockPacientes);
            
            const response = await request(app).get('/api/pacientes');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPacientes);
        });
    });

    describe('GET /api/pacientes/:id', () => {
        it('should get a paciente by id', async () => {
            const mockPaciente = { id: 1, nombre: 'Juan', apellido: 'Pérez', cedula: '12345678', fechaNacimiento: '1990-01-01', telefono: '98765432' };
            
            (pacienteService.getPacienteById as jest.Mock).mockResolvedValue(mockPaciente);
            
            const response = await request(app).get('/api/pacientes/1');
            
            expect(response.status).toBe(200); // Código de estado 200
            expect(response.body).toEqual(mockPaciente);
        });
    });

    describe('POST /api/pacientes', () => {
        it('should create a new paciente', async () => {
            const newPaciente = {
                nombre: 'Juan',
                apellido: 'Pérez',
                cedula: '12345678',
                fechaNacimiento: '1990-01-01',
                telefono: '98765432',
            };
            const mockResponse = {
                id: '1',
                ...newPaciente
            };
            (pacienteService.createPaciente as jest.Mock).mockResolvedValue(mockResponse);
            const response = await request(app).post('/api/pacientes').send(newPaciente);
        
            expect(response.status).toBe(201); // Código de estado 201 para creación exitosa
            expect(response.body).toEqual(mockResponse);
        });

        it('should return error when creating a paciente with existing cedula', async () => {
            const newPaciente = {
                nombre: 'Juan',
                apellido: 'Pérez',
                cedula: '12345678',
                fechaNacimiento: '1990-01-01',
                telefono: '98765432',
            };
            (pacienteService.createPaciente as jest.Mock).mockRejectedValue(new Error('Paciente ya registrado'));
            const response = await request(app).post('/api/pacientes').send(newPaciente);
            expect(response.status).toBe(400); // Código de estado 400 para solicitud incorrecta
            expect(response.body).toEqual({ message: 'Error al crear el pacienteError: Paciente ya registrado' });
        });
    });

    describe('PUT /api/pacientes/:id', () => {
        it('should update an existing paciente', async () => {
            const updatedPaciente = {
                nombre: 'Juanito',
                apellido: 'Pérez',
                cedula: '12345678',
                fechaNacimiento: '1990-01-01',
                telefono: '98765432',
            };

            (pacienteService.updatePaciente as jest.Mock).mockResolvedValue(updatedPaciente);

            const response = await request(app).put('/api/pacientes/1').send(updatedPaciente);
            
            expect(response.status).toBe(200); // Código de estado 200 para actualización exitosa
            expect(response.body).toEqual(updatedPaciente);
        });
    });

    describe('DELETE /api/pacientes/:id', () => {
        it('should delete a paciente', async () => {
            (pacienteService.deletePaciente as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).delete('/api/pacientes/1');
            
            expect(response.status).toBe(200); // Código de estado 200 para eliminación exitosa
            expect(response.body).toEqual({ message: 'Paciente eliminado correctamente' });
        });

        it('should return error when deleting a paciente fails', async () => {
            (pacienteService.deletePaciente as jest.Mock).mockRejectedValue(new Error('Error al eliminar el paciente'));

            const response = await request(app).delete('/api/pacientes/1');
            
            expect(response.status).toBe(400); // Código de estado 400 para error en la eliminación
            expect(response.body).toEqual({ message: 'Error al eliminar el pacienteError: Error al eliminar el paciente' });
        });
    }); 

});

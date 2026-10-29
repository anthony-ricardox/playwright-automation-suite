import { test, expect } from "@playwright/test";

const APIUrl = 'https://api-qa-fap2026.onrender.com/api';

test.describe('Testes de API - LojaQA', () => {

    test("GET /products - Validar catálogo de produtos", async ({ request }) => {
        const res = await request.get(`${APIUrl}/products`);
        
        // Valida status code 200
        expect(res.status()).toBe(200);
        
        // Valida se o status está entre 200 e 299 (corrigido para chamar a função .ok())
        expect(res.ok()).toBeTruthy();

        const bodyRes = await res.json();
        
        // Validações básicas do primeiro item (caso a API retorne dados fixos)
        if (bodyRes.length > 0) {
            expect(bodyRes[0]).toHaveProperty("_id");
            expect(bodyRes[0]).toHaveProperty("name");
            expect(typeof bodyRes[0].name).toBe('string');
        }
    });

    test("POST /login - Realizar login com sucesso", async ({ request }) => {
        const res = await request.post(`${APIUrl}/login`, {
            data: {
                "email": "admin@system.com",
                "password": "AdminPassword123"
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Valida status 200
        expect(res.status()).toBe(200);
        
        // Valida presença e formato do token
        const resBody = await res.json();
        expect(resBody).toHaveProperty("token");
        expect(typeof resBody.token).toBe('string');
        expect(resBody.token.length).toBeGreaterThan(10);
    });

    test("POST /login - Retornar erro ao tentar logar com senha incorreta", async ({ request }) => {
        const res = await request.post(`${APIUrl}/login`, {
            data: {
                "email": "admin@system.com",
                "password": "SenhaIncorreta"
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Valida status 401 (Unauthorized)
        expect(res.status()).toBe(401);
        
        const errobody = await res.json();
        expect(errobody.token).toBeUndefined();
        expect(errobody.error).toBe("Credenciais inválidas");
    });

});
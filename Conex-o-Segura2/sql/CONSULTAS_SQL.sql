-- Consultas para demonstrar o banco (cole no SQL Editor do Neon).

-- 1. Jogadores e saldo
SELECT j.id, j.nickname, j.avatar, c.saldo, j.criado_em
FROM jogadores j JOIN carteiras c ON c.jogador_id = j.id
ORDER BY j.id;

-- 2. Perguntas e suas fases
SELECT id, fase, categoria, enunciado, segura
FROM perguntas ORDER BY fase, id;

-- 3. Partidas realizadas
SELECT p.id, j.nickname, p.tipo, p.resultado, p.iniciada_em, p.finalizada_em
FROM partidas p JOIN jogadores j ON j.id = p.jogador_id
ORDER BY p.id DESC;

-- 4. Historico de respostas e moedas recebidas
SELECT j.nickname, q.fase, q.categoria, r.escolha, r.acertou, r.moedas, r.respondida_em
FROM respostas r
JOIN partidas p ON p.id = r.partida_id
JOIN jogadores j ON j.id = p.jogador_id
JOIN perguntas q ON q.id = r.pergunta_id
ORDER BY r.id DESC;

-- 5. Compras de cada jogador
SELECT j.nickname, l.nome, l.categoria, l.preco, i.equipado, i.comprado_em
FROM inventario i
JOIN jogadores j ON j.id = i.jogador_id
JOIN itens_loja l ON l.id = i.item_id
ORDER BY i.comprado_em DESC;

-- 6. Recordes da Corrida da Bolha
SELECT j.nickname, MAX(r.distancia) AS recorde_metros
FROM resultados_corrida r
JOIN partidas p ON p.id = r.partida_id
JOIN jogadores j ON j.id = p.jogador_id
GROUP BY j.id, j.nickname
ORDER BY recorde_metros DESC;

-- 7. Resultados da Memoria Digital
SELECT j.nickname, m.pares, m.jogadas, m.erros, m.venceu
FROM resultados_memoria m
JOIN partidas p ON p.id = m.partida_id
JOIN jogadores j ON j.id = p.jogador_id
ORDER BY p.id DESC;

-- 8. Historico (extrato) de moedas
SELECT j.nickname, m.tipo, m.valor, m.item_id, m.criada_em
FROM movimentacoes m JOIN jogadores j ON j.id = m.jogador_id
ORDER BY m.id DESC;

-- 9. Ranking (mesma consulta usada pelo jogo)
SELECT j.nickname,
  (SELECT COUNT(*) FROM respostas r JOIN partidas p ON p.id = r.partida_id
   WHERE p.jogador_id = j.id AND r.acertou)::int AS acertos,
  (SELECT COALESCE(MAX(c.distancia), 0) FROM resultados_corrida c
   JOIN partidas p ON p.id = c.partida_id WHERE p.jogador_id = j.id) AS recorde
FROM jogadores j
ORDER BY acertos DESC, recorde DESC, j.nickname ASC
LIMIT 10;

-- 10. Conferencia: saldo da carteira = soma do extrato
SELECT j.nickname, c.saldo, COALESCE(SUM(m.valor), 0) AS soma_extrato
FROM jogadores j
JOIN carteiras c ON c.jogador_id = j.id
LEFT JOIN movimentacoes m ON m.jogador_id = j.id
GROUP BY j.nickname, c.saldo;

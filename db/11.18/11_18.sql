-- Jelenítsük meg a 13.A osztály tanulóinak nevét!

SELECT nev
FROM diakok 
INNER JOIN osztalyok 
ON diakok.osztaly_id = osztalyok.id
WHERE osztalyok.nev = "13.A";

-- Jelenítsük meg az átlagfizetésnél többet kereső dolgozókat!

-- Nézet táblával lett megoldva

CREATE VIEW atlag_fizetes AS SELECT AVG(fizetes) FROM dolgozok;

-- Jelenítsük meg a 13.A és 13.B osztály tanulóit!

SELECT diakok.nev
FROM diakok 
INNER JOIN osztalyok 
ON diakok.osztaly_id = osztalyok.id
WHERE osztalyok.nev LIKE '13.A' OR osztalyok.nev LIKE '13.B' ;

-- Mely osztályokban van legalább egy tanuló?

SELECT DISTINCT(o.osztaly_nev)
FROM osztalyok AS o
INNER JOIN diakok AS d
ON d.osztaly_id = o.id
WHERE d.osztaly_id = o.id;

-- Mely osztályokban nincs tanuló?

SELECT DISTINCT o.osztaly_nev
FROM osztalyok AS o
LEFT JOIN diakok AS d ON d.osztaly_id = o.id
WHERE d.osztaly_id IS NULL;

-- Keressük meg a legdrágább terméket!

SELECT nev, MAX(ar)
FROM termekek
LIMIT 1;

-- Osztályonkénti átlagfizetés, csak 500 000 Ft felett!

SELECT osztaly_id, AVG(fizetes)
FROM dolgozok
GROUP BY osztaly_id
HAVING AVG(fizetes) > 500000

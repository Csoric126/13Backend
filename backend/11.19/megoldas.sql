
-- 1
SELECT berletek.id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto, tipusok.nev FROM berletek INNER JOIN tipusok ON berletek.tipus_id = tipusok.id ORDER BY berletek.ar ASC;

-- 2
SELECT berletek.id, berletek.tipus_id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto FROM berletek WHERE berletek.ervenyesseg_nap <= 30;

-- 3 
SELECT berletek.id, berletek.tipus_id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto FROM berletek WHERE megnevezes LIKE "%?%";

-- 4
SELECT tipusok.nev, COUNT(berletek.id) AS "berletek_szama", ROUND(AVG(berletek.ar)) AS "atlagos_ar" FROM berletek INNER JOIN tipusok ON berletek.tipus_id = tipusok.id GROUP BY berletek.tipus_id;

-- 5 
SELECT berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap FROM berletek WHERE ar > 20000 ORDER BY ervenyesseg_nap DESC; 
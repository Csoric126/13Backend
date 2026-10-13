
-- 6.
SELECT * FROM `zenekarok`;


-- 7.
INSERT INTO `zenekarok` (id, nev, stilus_id, orszag, varos, aktiv_evek, tagok, legsikeresebb_album, kep_url) 
VALUES(103, "Silver Vortex", 3, "Svédország", "Göteberg", "1972-1981", "Lars Holm, Erik Sundberg, Nils Johanson", "Twilight Machines", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Silhouettes_of_a_band_on_s
tage.jpg/640px-Silhouettes_of_a_band_on_stage.jpg");


--8.
SELECT stilus_neve FROM `stilusok`;

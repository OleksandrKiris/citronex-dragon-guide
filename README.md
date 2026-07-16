# CITRONEX - osobny przewodnik smoka

Lekka brama przed szkoleniem lokalizacyjnym. Otwiera się przed stroną Siechnic, Ryczywołu albo Zgorzelca / Bogatyni, pokazuje tekst i odtwarza nagranie w wybranym języku.

## Adres

`https://oleksandrkiris.github.io/citronex-dragon-guide/`

Przykład testowy:

`?location=siechnice&lang=pl&welcome=1`

## Działanie

- język jest wybierany w Hydrze i przekazywany do smoka;
- nagranie MP3 jest ładowane dopiero po kliknięciu;
- po zakończeniu przewodnik zapisuje ukończenie osobno dla każdej lokalizacji w przeglądarce;
- przy następnym wejściu przewodnik pomija się i otwiera właściwą stronę;
- `welcome=1` pozwala ponownie otworzyć smoka podczas kontroli;
- lokalizacja jest wybierana z wewnętrznej listy dozwolonych adresów, więc link nie może przekierować pracownika w przypadkowe miejsce.

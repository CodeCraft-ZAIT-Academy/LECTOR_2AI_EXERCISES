# Exercises

Tento repozitár obsahuje zbierku cvičení, ktoré sú postupne nahrávané z vyučovacích lekcií.  
Cvičenia sú navrhnuté tak, aby krok za krokom upevňovali preberané koncepty a umožnili študentom  
precvičiť si ich v praxi, experimentovať a získať väčšiu istotu.  

Každé cvičenie je spracované tak, aby bolo samostatne zvládnuteľné, no zároveň zapadalo  
do širšej postupnosti tém. Postupom času sa tento repozitár rozrastie na kompletnú sadu materiálov,  
ktoré je možné využiť počas lekcií aj na samostatné štúdium. 

## Správa riešení

Prístup k riešeniam sa nastavuje v `exercises/manifest.js`:

```js
window.EXERCISE_SETTINGS = {
	solutionsEnabled: false,
	unlockedCategories: []
};
```

Po prebratí témy nastavte `solutionsEnabled` na `true` a pridajte kategóriu do `unlockedCategories`, napríklad `['Tables']`. Jednotlivé riešenie je možné odomknúť vlastnosťou `solutionUnlocked: true` pri konkrétnom cvičení.
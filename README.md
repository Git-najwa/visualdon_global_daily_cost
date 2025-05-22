#  Combien coûte un jour de vie dans le monde ?💰  

## **📖 Contexte**  
Le projet **"Combien coûte un jour de vie dans le monde ?"** vise à comparer le coût de la vie dans différents pays à travers une visualisation de données interactive. L'objectif est de permettre aux utilisateurs d'explorer les différences de dépenses quotidiennes selon leur lieu de résidence ou d'expatriation.  

Les données utilisées proviennent de sources fiables et sont mises à jour régulièrement :  

- **[Numbeo](https://www.numbeo.com/cost-of-living/)** : Base de données collaborative fournissant des indices de coût de la vie, prix des biens essentiels et salaires moyens.  
- **[Statista](https://www.statista.com/)** : Statistiques économiques sur les revenus et le coût de la vie par pays.  
- **[Banque Mondiale](https://data.worldbank.org/)** : Indices macroéconomiques et comparaison internationale des coûts.  

Ces données sont collectées et agrégées par des institutions, chercheurs et contributeurs, offrant une vue globale des dépenses quotidiennes dans le monde.  



## **🗂️ Format et Structure des Données**

Les données sont fournies au format **JSON**, structuré par pays. Chaque pays contient :

* **`cost`** : coût moyen d’une journée de vie (ex. : `"72€"`)
* **`activities`** : liste des postes de dépenses journalières (eau, repas, transport, etc.)

📌 **Exemple de structure :**

```json
"Canada": {
  "cost": "72€",
  "activities": [
    "Eau et électricité: 2.3€",
    "Petit-déjeuner: 2.2€",
    "Transport: 1.6€",
    "Courses: 5.8€",
    "Souper: 4.8€",
    "Activité: 4€",
    "Loyer: 5.3€"
  ]
}
```

Ces données permettent de générer des visualisations interactives (carte, barplot circulaire, simulation de journée) et de comparer les structures de dépenses entre les pays.



## **🎯 Objectif du Projet**  

L’objectif principal est d’explorer le coût de la vie à travers le monde grâce à une visualisation interactive. Ce projet permet aux utilisateurs de naviguer dans les données, d’observer les disparités économiques entre les pays et d’identifier des tendances globales.  

Les utilisateurs pourront comparer les différences de coûts quotidiens et explorer les variations de pouvoir d'achat selon les régions, en mettant en lumière les contrastes économiques internationaux.

### **🖼️ Wireframe**  

📌 **Accédez au wireframe ici** 👉 [Figma - Wireframe VisualDon](https://www.figma.com/design/f38k1xOrdXAziVvV0ZuVHP/VisualDon?node-id=47-3943&t=iobNvDFSUINVNXgm-1)  

Ce wireframe sert de guide pour le développement de l’interface utilisateur. 

## **📚 Références**  

Plusieurs plateformes et études utilisent les mêmes sources de données que notre projet pour analyser et comparer le coût de la vie à travers le monde :  

- **[Combien-coute.net](https://www.combien-coute.net/cout-de-la-vie/)** : Utilise **Numbeo** comme principale source de données pour fournir des estimations sur les prix des biens et services dans différents pays et villes. L’objectif est d’aider les utilisateurs à comparer leurs dépenses quotidiennes en fonction de leur localisation.  
- **[MoveHub - Global Cost of Living Index](https://www.movehub.com/blog/cost-of-living-index/)** : Se base sur **Numbeo** et **Statista** pour établir ses classements du coût de la vie par pays. Cette plateforme s’adresse principalement aux expatriés et aux personnes souhaitant déménager à l’international en leur offrant une analyse détaillée des coûts.  
- **[The Economist - Big Mac Index](https://www.economist.com/big-mac-index/)** : Cette méthode unique compare le prix du Big Mac dans différents pays pour évaluer les écarts de pouvoir d’achat et le taux de change implicite des devises. Bien qu’indépendant, ce projet utilise aussi des références de la **Banque Mondiale** et **Statista** pour enrichir son analyse économique.  
- **[Our World in Data](https://ourworldindata.org/)** : Exploite les données de la **Banque Mondiale** pour analyser les inégalités économiques à l’échelle mondiale et comprendre comment le pouvoir d’achat varie selon les pays. L’objectif est de mettre en lumière les disparités de niveau de vie à travers des visualisations interactives.  
- **[Numbeo](https://www.numbeo.com/cost-of-living/)** : Plateforme collaborative fournissant des indices de coût de la vie, prix des biens essentiels et salaires moyens à travers le monde.  
- **[Statista](https://www.statista.com/)** : Propose des statistiques économiques sur les revenus et le coût de la vie par pays.  
- **[Banque Mondiale](https://data.worldbank.org/)** : Source de données macroéconomiques incluant les indices de coût de la vie et les salaires moyens.  

Ces références montrent que les données sur le coût de la vie sont utilisées à des fins variées :  

✔️ **Comparer les prix et le pouvoir d’achat**  
✔️ **Aider à la prise de décision pour les expatriés et investisseurs**  
✔️ **Analyser les inégalités économiques mondiales**  

📌 **Ce projet s’inscrit dans une démarche analytique et exploratoire, visant à offrir un outil interactif, immersive et accessible pour mieux comprendre les écarts économiques mondiaux.** 


## **📷 Sources des images**

| Nom          | Lien                                                                                                                                                                                                                                                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avatar1      | [https://i1.sndcdn.com/avatars-NyM8EoH9W2UmWrsu-zfB8Yw-t500x500.jpg](https://i1.sndcdn.com/avatars-NyM8EoH9W2UmWrsu-zfB8Yw-t500x500.jpg)                                                                                                                                                                                                                       |
| avatar2      | [https://art.pixilart.com/519d22531670ff8.png](https://art.pixilart.com/519d22531670ff8.png)                                                                                                                                                                                                                                                                   |
| avatar3      | [https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Fianwxza9szq81.png%3Fwidth%3D1080%26crop%3Dsmart%26auto%3Dwebp%26s%3D95dc61d08256d56628a055f07cd269246f98855d](https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Fianwxza9szq81.png%3Fwidth%3D1080%26crop%3Dsmart%26auto%3Dwebp%26s%3D95dc61d08256d56628a055f07cd269246f98855d) |
| dodo         | [https://64.media.tumblr.com/d031a5cf307d50e0cd027fb37ba53457/tumblr\_pc11hqvLWD1xwr65fo1\_500.gif](https://64.media.tumblr.com/d031a5cf307d50e0cd027fb37ba53457/tumblr_pc11hqvLWD1xwr65fo1_500.gif)                                                                                                                                                           |
| mapFond      | [https://i.pinimg.com/originals/6e/32/a3/6e32a32281a46894e5c5857e19c63cf2.gif](https://i.pinimg.com/originals/6e/32/a3/6e32a32281a46894e5c5857e19c63cf2.gif)                                                                                                                                                                                                   |
| rocket-pixel | [https://www.vecteezy.com/png/13519076-pixel-art-rocket](https://www.vecteezy.com/png/13519076-pixel-art-rocket)                                                                                                                                                                                                                                               |
| scene1       | [https://i.pinimg.com/originals/9b/0b/c6/9b0bc63a987fbaa2beaa44ba94e105d7.gif](https://i.pinimg.com/originals/9b/0b/c6/9b0bc63a987fbaa2beaa44ba94e105d7.gif)                                                                                                                                                                                                   |
| scene2       | [https://64.media.tumblr.com/e542f6cad869ae29d9806ff3a8ac0d85/c3e560fa3a85d23e-a2/s500x750/cf3e94ceb1d0d2c41dc5213ca7c7e4f39a033dac.gif](https://64.media.tumblr.com/e542f6cad869ae29d9806ff3a8ac0d85/c3e560fa3a85d23e-a2/s500x750/cf3e94ceb1d0d2c41dc5213ca7c7e4f39a033dac.gif)                                                                               |
| scene3       | [https://d112y698adiu2z.cloudfront.net/photos/production/software\_photos/002/429/881/datas/original.gif](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/429/881/datas/original.gif)                                                                                                                                              |
| scene4       | [https://i.pinimg.com/originals/65/f6/0f/65f60ff3a1cda360b27f1814943f8b62.gif](https://i.pinimg.com/originals/65/f6/0f/65f60ff3a1cda360b27f1814943f8b62.gif)                                                                                                                                                                                                   |
| scene5       | [https://mir-s3-cdn-cf.behance.net/project\_modules/disp/64c19667998673.5b4ddee2642c3.gif](https://mir-s3-cdn-cf.behance.net/project_modules/disp/64c19667998673.5b4ddee2642c3.gif)                                                                                                                                                                            |
| scene6       | [https://mir-s3-cdn-cf.behance.net/project\_modules/hd/7ac05e82098695.5d133ab9ac506.gif](https://mir-s3-cdn-cf.behance.net/project_modules/hd/7ac05e82098695.5d133ab9ac506.gif)                                                                                                                                                                                |
| scene7       | [https://i.pinimg.com/originals/1b/83/dc/1b83dce6c2a59c92d2dfdd14df85c377.gif](https://i.pinimg.com/originals/1b/83/dc/1b83dce6c2a59c92d2dfdd14df85c377.gif)                                                                                                                                                                                                   |
| scene8       | [https://wallpapercave.com/wp/wp11115924.gif](https://wallpapercave.com/wp/wp11115924.gif)                                                                                                                                                                                                                                                                     |
| scene9       | [https://i.pinimg.com/originals/d5/6f/49/d56f4945ea02b29d1ef5a8ea9042c8c9.gif](https://i.pinimg.com/originals/d5/6f/49/d56f4945ea02b29d1ef5a8ea9042c8c9.gif)                                                                                                                                                                                                   |
| starfield    | [https://cdna.artstation.com/p/assets/images/images/058/151/774/original/yana-chuklova-.gif?1673499537](https://cdna.artstation.com/p/assets/images/images/058/151/774/original/yana-chuklova-.gif?1673499537)                                                                                                                                                 |


---
Ce projet a été réalisé dans le cadre d’un travail académique au sein de la Haute École d’Ingénierie et de Gestion du Canton de Vaud (HEIG-VD).


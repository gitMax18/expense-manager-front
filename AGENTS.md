# Description

Cette application sert a gérer ces dépenses en enregistrant les entrés et sorties sur un ou plusieurs comptes associer a un utilisateur.

# Fonctionnalitées

- Chaque utilisateur pourra avoir des comptes
- Possibilité d'avoir des revenues mensuel (salaire, loyer etc...)
- Possibilité d'avoir des dépense mensuel (loyer, assurance, pret etc...)
- Chaque dépense aura ca catégorie

# Liens

- Backend de l'application : https://github.com/gitMax18/expense-manager-back

# Consigne de code

## state management

- L'application utilise rxjs signal pour la gestion des états
- Utilisation de withRequestStatus feature pour la gestion des états des requetes http
- Utilisation de withEntity pour la gestion des entités

## components

- Les composants utilisent les signaux
- Les input/outpout utilisent les nouvelles fonctionnalitées input.required/output
- Le style d'un composant est dans son propre fichier scss
- Le template d'un composant est comprit avec le ts

## form

- Utilisation des reactives form si plusieurs champs
- Utilisation de form-item comme wrapper
- Utilisation de form-label pour le label
- Utilisation de composant primeng pour les champs
- Utilisation de form-error pour la gestion des erreurs
- Ne pas utiliser le FormBuilder

## styles

- L'application utilise primeng pour les composants de base
- L'application utilise le scss
- La méthode BEM est utilisé pour les class scss

## CI/CD

- 3 branches sont gérées par la CI/CD, dev (execute les tests), staging (test et création d'une image pour déploiment en stagging), prod (test et création d'une image pour déploiment en production)

- Utilisation de github actions

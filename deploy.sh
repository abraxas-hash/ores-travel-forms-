#!/bin/bash

# Script para desplegar cambios a Vercel
# Ejecutar: bash deploy.sh

echo "🚀 Desplegando cambios a Vercel..."
echo ""

# Verificar que estamos en main
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "❌ ERROR: No estás en la rama main"
    echo "   Rama actual: $BRANCH"
    exit 1
fi

# Mostrar commits pendientes
echo "📦 Commits pendientes:"
git log origin/main..HEAD --oneline
echo ""

# Confirmar con el usuario
read -p "¿Deseas hacer push de estos cambios? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "⏳ Haciendo push a origin/main..."
    git push origin main

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Push exitoso!"
        echo "🌐 Vercel desplegará automáticamente en:"
        echo "   https://ores-travel-forms.vercel.app/"
        echo ""
        echo "⏱️  Tiempo estimado: 2-3 minutos"
        echo ""
        echo "📋 Verifica después del despliegue:"
        echo "   1. https://ores-travel-forms.vercel.app/formulario-programas-fijos.html"
        echo "      → PASO 5: TRANSPORTE (Detección automática)"
        echo "   2. https://ores-travel-forms.vercel.app/formulario-tour-personalizado.html"
        echo "      → PASO 3: TRANSPORTE (Detección automática)"
    else
        echo ""
        echo "❌ Error al hacer push"
        echo "   Revisa los permisos del repositorio"
    fi
else
    echo "❌ Push cancelado"
fi

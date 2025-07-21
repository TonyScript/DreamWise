#!/bin/bash

echo "🔧 Fixing browse.html card titles and descriptions..."

# Fix h3 tags - remove text-white and transition classes, add mb-2
sed -i '' 's/class="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300"/class="font-semibold mb-2"/g' browse.html

# Fix p tags - change from text-xs to text-sm, add opacity and transition
sed -i '' 's/class="text-xs text-gray-400 mt-1">Spiritual meaning/class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Spiritual meaning/g' browse.html

echo "✅ Fixed h3 and p tag classes"

# Now fix specific descriptions for each dream
declare -A descriptions=(
    ["Book"]="Knowledge & wisdom"
    ["Bottle"]="Containment & preservation"
    ["Box"]="Hidden secrets"
    ["Bread"]="Nourishment & sustenance"
    ["Bridge"]="Connection & transition"
    ["Butterfly"]="Transformation & rebirth"
    ["Flowers"]="Beauty & growth"
    ["Food"]="Nourishment & satisfaction"
    ["Forest"]="Nature & mystery"
    ["Forgiveness"]="Healing & release"
    ["Fox"]="Cunning & intelligence"
    ["Frog"]="Transformation & cleansing"
    ["Hands"]="Action & creation"
    ["Loneliness"]="Isolation & reflection"
    ["Love"]="Connection & affection"
    ["Mouse"]="Small details & timidity"
    ["Mouth"]="Communication & expression"
    ["Prophet"]="Divine guidance"
    ["Rope"]="Binding & connection"
    ["Rosary"]="Prayer & devotion"
    ["Turtle"]="Patience & longevity"
)

# Replace descriptions
for title in "${!descriptions[@]}"; do
    desc="${descriptions[$title]}"
    sed -i '' "s/<h3 class=\"font-semibold mb-2\">${title}<\/h3>.*<p class=\"text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300\">Spiritual meaning<\/p>/<h3 class=\"font-semibold mb-2\">${title}<\/h3>\n                        <p class=\"text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300\">${desc}<\/p>/g" browse.html
done

echo "✅ Updated all descriptions"
echo "🎉 Browse.html card styles fixed!"
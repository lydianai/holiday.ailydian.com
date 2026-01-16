#!/bin/bash

# AILYDIAN NIRVANA MODE - Backup Cleanup Script
# Cleans up all backup files safely

PROJECT_DIR="/Users/sardag/Desktop/projeler/holiday.ailydian.com"
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="cleanup-log-${BACKUP_TIMESTAMP}.txt"

cd "$PROJECT_DIR" || exit 1

echo "🔥 AILYDIAN NIRVANA MODE - BACKUP CLEANUP"
echo "========================================"
echo ""
echo "⏰ Starting at: $(date)"
echo "📁 Project: $PROJECT_DIR"
echo ""

# Count files before cleanup
TOTAL_BEFORE=$(find . -type f \( -name "*.pathbak" -o -name "*.pathbak2" -o -name "*.backup" -o -name "*.old" -o -name "*.ultra" -o -name "*.optimized" \) | wc -l | tr -d ' ')
echo "📊 Total backup files found: $TOTAL_BEFORE"
echo ""

# Create backup list before deletion
echo "📝 Creating list of files to be deleted..."
find . -type f \( -name "*.pathbak" -o -name "*.pathbak2" -o -name "*.backup" -o -name "*.old" -o -name "*.ultra" -o -name "*.optimized" \) > "$LOG_FILE"

echo "✅ File list saved to: $LOG_FILE"
echo ""

# PHASE 1: Clean .next/ (safe - build artifacts)
echo "🗑️  PHASE 1: Cleaning .next/ directory..."
NEXT_COUNT=$(find .next -type f -name "*.old" 2>/dev/null | wc -l | tr -d ' ')
if [ "$NEXT_COUNT" -gt 0 ]; then
    find .next -type f -name "*.old" -delete 2>/dev/null
    echo "   ✅ Deleted $NEXT_COUNT files from .next/"
else
    echo "   ℹ️  No backup files in .next/"
fi
echo ""

# PHASE 2: Clean .archive/ (safe - archived content)
echo "🗑️  PHASE 2: Cleaning .archive/ directory..."
ARCHIVE_COUNT=$(find .archive -type f \( -name "*.pathbak*" -o -name "*.backup" \) 2>/dev/null | wc -l | tr -d ' ')
if [ "$ARCHIVE_COUNT" -gt 0 ]; then
    find .archive -type f \( -name "*.pathbak*" -o -name "*.backup" \) -delete 2>/dev/null
    echo "   ✅ Deleted $ARCHIVE_COUNT files from .archive/"
else
    echo "   ℹ️  No backup files in .archive/"
fi
echo ""

# PHASE 3: Clean src/ (careful - source code)
echo "🗑️  PHASE 3: Cleaning src/ directory..."
SRC_COUNT=$(find src -type f \( -name "*.pathbak*" -o -name "*.backup" -o -name "*.old" -o -name "*.ultra" -o -name "*.optimized" \) 2>/dev/null | wc -l | tr -d ' ')
if [ "$SRC_COUNT" -gt 0 ]; then
    # Delete source backup files
    find src -type f \( -name "*.pathbak*" -o -name "*.backup" -o -name "*.old" -o -name "*.ultra" -o -name "*.optimized" \) -delete 2>/dev/null
    echo "   ✅ Deleted $SRC_COUNT files from src/"
else
    echo "   ℹ️  No backup files in src/"
fi
echo ""

# Count files after cleanup
TOTAL_AFTER=$(find . -type f \( -name "*.pathbak" -o -name "*.pathbak2" -o -name "*.backup" -o -name "*.old" -o -name "*.ultra" -o -name "*.optimized" \) 2>/dev/null | wc -l | tr -d ' ')

# Summary
echo "========================================"
echo "✅ CLEANUP COMPLETE!"
echo ""
echo "📊 Summary:"
echo "   Before: $TOTAL_BEFORE files"
echo "   After:  $TOTAL_AFTER files"
echo "   Deleted: $((TOTAL_BEFORE - TOTAL_AFTER)) files"
echo ""
echo "📝 Detailed log saved to: $LOG_FILE"
echo "⏰ Finished at: $(date)"
echo ""
echo "🔥 AILYDIAN NIRVANA MODE - Cleanup successful!"
echo "========================================"

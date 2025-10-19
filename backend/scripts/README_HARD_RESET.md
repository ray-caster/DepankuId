# Hard Reset Scripts

This directory contains scripts for performing hard resets of your data. **Use with extreme caution** - these scripts will permanently delete data.

## 🚨 WARNING

These scripts are **DESTRUCTIVE** and will **permanently delete data**. Use only for:
- Development/testing environments
- Complete fresh starts
- Emergency data cleanup

## Scripts Available

### 1. `quick_hard_reset.py` - Quick Reset (Recommended)

Deletes all opportunities and applications from both Firestore and Algolia.

**Usage:**
```bash
# Interactive mode (asks for confirmation)
python scripts/quick_hard_reset.py

# Skip confirmation prompt
python scripts/quick_hard_reset.py --confirm
```

**What it deletes:**
- All opportunities from Firestore
- All applications from Firestore
- All data from Algolia index

### 2. `hard_reset_all_data.py` - Complete Reset (Nuclear Option)

Deletes **ALL data** from Firestore and Algolia - every collection, every document.

**Usage:**
```bash
# Complete reset (requires double confirmation)
python scripts/hard_reset_all_data.py --confirm

# Verbose output
python scripts/hard_reset_all_data.py --confirm --verbose

# Only delete Firestore data
python scripts/hard_reset_all_data.py --confirm --firestore-only

# Only delete Algolia data
python scripts/hard_reset_all_data.py --confirm --algolia-only
```

**What it deletes:**
- **ALL** Firestore collections and documents
- **ALL** Algolia data
- User accounts, profiles, settings, etc.

## Safety Features

### Multiple Confirmations
- Script requires `--confirm` flag
- Additional interactive confirmation required
- Clear warning messages displayed

### Batch Processing
- Large datasets are processed in batches
- Prevents memory issues and timeouts
- Progress reporting for large deletions

### Verification
- Optional verification step to confirm deletion
- Detailed reporting of what was deleted
- Error handling and rollback capabilities

## Examples

### Quick Reset (Most Common)
```bash
cd backend
python scripts/quick_hard_reset.py --confirm
```

### Complete Reset (Nuclear Option)
```bash
cd backend
python scripts/hard_reset_all_data.py --confirm
# Then type "DELETE ALL DATA" when prompted
```

### Development Workflow
```bash
# 1. Quick reset to clean up test data
python scripts/quick_hard_reset.py --confirm

# 2. Seed with fresh test data
python scripts/seed_sample_opportunities.py

# 3. Verify everything works
python scripts/test_application_flow.py
```

## Recovery

**There is no recovery** - deleted data cannot be restored. Always:
- Backup important data before running these scripts
- Test on development environments first
- Use version control for code changes

## Troubleshooting

### Permission Errors
Make sure your Firebase service account has the necessary permissions:
- Firestore: `Cloud Datastore User` or `Cloud Datastore Owner`
- Algolia: Admin API key with delete permissions

### Service Unavailable
If Algolia service is not available:
- Scripts will skip Algolia operations
- Firestore operations will still proceed
- Check your Algolia configuration

### Partial Failures
If some operations fail:
- Check the error messages
- Verify your Firebase/Algolia credentials
- Some data may remain - run verification to check

## Best Practices

1. **Always test first** on development environments
2. **Backup important data** before running
3. **Use quick_hard_reset.py** for most cases
4. **Only use hard_reset_all_data.py** when you need to delete everything
5. **Verify the cleanup** after running scripts
6. **Document what you deleted** for team members

## Integration with CI/CD

These scripts can be integrated into your deployment pipeline:

```bash
# In your deployment script
if [ "$ENVIRONMENT" = "development" ]; then
    echo "Resetting development data..."
    python scripts/quick_hard_reset.py --confirm
    python scripts/seed_sample_opportunities.py
fi
```

Remember: **With great power comes great responsibility!** 🕷️

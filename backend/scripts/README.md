# Database Reset Scripts

This directory contains scripts for managing the opportunities database.

## Scripts

### 1. `quick_reset.py`
**Simple hard reset - deletes all opportunities from Firebase and Algolia**

```bash
python scripts/quick_reset.py
```

- ✅ Deletes all opportunities from Firebase Firestore
- ✅ Clears all records from Algolia search index
- ⚠️ **WARNING**: This action cannot be undone!

### 2. `full_reset.py`
**Complete reset with sample data**

```bash
# Reset and add sample data
python scripts/full_reset.py

# Reset without sample data
python scripts/full_reset.py --no-seed

# Skip confirmation prompt
python scripts/full_reset.py --confirm
```

- ✅ Deletes all opportunities from Firebase and Algolia
- ✅ Adds 3 sample opportunities for testing
- ✅ Syncs sample data to Algolia

### 3. `hard_reset_opportunities.py`
**Comprehensive reset with detailed logging and confirmation**

```bash
python scripts/hard_reset_opportunities.py
```

- ✅ Interactive confirmation prompts
- ✅ Detailed logging of all operations
- ✅ Option to delete application data
- ✅ Comprehensive error handling

### 4. `seed_sample_opportunities.py`
**Add sample opportunities without resetting**

```bash
python scripts/seed_sample_opportunities.py
```

- ✅ Adds 5 sample opportunities
- ✅ Syncs to Algolia
- ✅ Safe to run multiple times

## Sample Data

The scripts create sample opportunities including:

- **Software Engineer Internship** (TechCorp Inc.)
- **Marketing Coordinator** (StartupXYZ) 
- **Data Science Fellowship** (AI Research Lab)
- **Product Design Intern** (DesignStudio)
- **DevOps Engineer** (CloudTech Solutions)

## Usage Examples

```bash
# Quick reset for testing
python scripts/quick_reset.py

# Full reset with sample data
python scripts/full_reset.py --confirm

# Add more sample data
python scripts/seed_sample_opportunities.py

# Nuclear option - everything
python scripts/hard_reset_opportunities.py
```

## Requirements

- Firebase credentials configured
- Algolia credentials configured
- Python environment with required packages

## Safety

⚠️ **All reset scripts permanently delete data!**

- Always backup important data before running
- Test in development environment first
- Use `--confirm` flag to skip prompts in automated scripts

# SauceDemo Automation Testing

Automation testing suite untuk aplikasi e-commerce SauceDemo menggunakan Playwright dan TypeScript.

## Prerequisites

- Node.js (v16 atau lebih tinggi) - [Download di sini](https://nodejs.org/)
- npm atau yarn
- Git (opsional)

## Installation

### Step 1: Clone atau Download Project
```bash
# Jika menggunakan Git
git clone <repository-url>
cd saucedemo-automation

# Atau extract ZIP file yang sudah di-download
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Install Playwright Browsers
```bash
npx playwright install
```


## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run specific test file:
```bash
npx playwright test tests/login.spec.ts
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```

### View test report:
```bash
npx playwright show-report
```

## Test Coverage

### 1. Customer Login & Validation
- Login dengan kredensial valid
- Verifikasi redirect ke Product Listing page
- Login dengan kredensial invalid
- Verifikasi error message

### 2. End-to-End Checkout Flow
- Add dua item berbeda ke cart
- Navigate ke cart page
- Proceed to checkout
- Fill customer information
- **Critical Assertion**: Verify Item Total + Tax = Total
- Complete order
- Verify "Thank You" confirmation message

### 3. Sorting Functionality
- Sort products by "Price (high to low)"
- Verify item pertama adalah yang paling mahal

## Configuration

Edit `playwright.config.ts` untuk mengubah:
- Browser yang digunakan
- Timeout settings
- Screenshot/video options
- Report format

## Credentials

Default credentials tersimpan di `test-data/credentials.ts`:
- Username: `standard_user`
- Password: `secret_sauce`

## CI/CD Integration

Tests dapat dijalankan di CI/CD pipeline. Set environment variable `CI=true` untuk mengaktifkan:
- Headless mode
- Retry pada failure
- Parallel execution
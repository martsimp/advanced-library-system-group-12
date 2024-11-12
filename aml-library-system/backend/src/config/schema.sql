-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL CHECK (role IN ('member', 'librarian', 'manager', 'accountant')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    street_address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    notifications_enabled BOOLEAN DEFAULT true,
    outstanding_fines DECIMAL(10,2) DEFAULT 0.00,
    firebase_uid VARCHAR(128) UNIQUE
);

-- MEDIA TABLE
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    publication_year INTEGER,
    format VARCHAR(50) CHECK (format IN ('book', 'journal', 'CD', 'DVD')),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'reserved')),
    description TEXT,
    total_copies INTEGER NOT NULL
);

-- BRANCHES TABLE
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street_address VARCHAR(255),
    postal_code VARCHAR(20),
    monday_friday_open TIME,
    monday_friday_close TIME,
    saturday_open TIME,
    saturday_close TIME,
    sunday_open TIME,
    sunday_close TIME
);

-- BRANCH MEDIA INVENTORY TABLE
CREATE TABLE branch_media_inventory (
    branch_id INTEGER REFERENCES branches(id),
    media_id INTEGER REFERENCES media(id),
    available_copies INTEGER DEFAULT 0,
    reserved_copies INTEGER DEFAULT 0,
    PRIMARY KEY (branch_id, media_id)
);

-- RESERVATIONS TABLE
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    media_id INTEGER REFERENCES media(id),
    branch_id INTEGER REFERENCES branches(id),
    reserve_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('active', 'canceled', 'fulfilled')),
    queue_position INTEGER,
    notification_sent BOOLEAN DEFAULT false
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    media_id INTEGER REFERENCES media(id),
    branch_id INTEGER REFERENCES branches(id),
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('borrowed', 'returned', 'overdue')),
    fine DECIMAL(10,2) DEFAULT 0.00
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    media_id INTEGER REFERENCES media(id),
    notification_type VARCHAR(50) CHECK (notification_type IN ('reservation_available', 'due_date', 'overdue')),
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT,
    status VARCHAR(50) CHECK (status IN ('sent', 'pending', 'failed'))
); 
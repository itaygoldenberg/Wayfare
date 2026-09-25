DROP DATABASE IF EXISTS wayfare;

CREATE DATABASE wayfare;

USE wayfare;

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('User', 'Admin') NOT NULL DEFAULT 'User'
);

CREATE TABLE vacations (
    vacationId INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    price DECIMAL(7, 2) NOT NULL,
    imageName VARCHAR(255) NOT NULL
);

CREATE TABLE likes (
    userId INT NOT NULL,
    vacationId INT NOT NULL,
    PRIMARY KEY (userId, vacationId),
    FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
    FOREIGN KEY (vacationId) REFERENCES vacations (vacationId) ON DELETE CASCADE
);

-- Dates are relative to the day this script runs, so there are always ended, active and future vacations.
INSERT INTO
    vacations (
        destination,
        description,
        startDate,
        endDate,
        price,
        imageName
    )
VALUES (
        'Rome, Italy',
        'Walk the Forum at dawn before the crowds arrive, stand under the open eye of the Pantheon, and eat cacio e pepe in a Trastevere courtyard. Three thousand years of city, layered street on street.',
        CURDATE() - INTERVAL 196 DAY,
        CURDATE() - INTERVAL 189 DAY,
        1890.00,
        'rome.jpg'
    ),
    (
        'Kyoto, Japan',
        'Cherry blossom season in the old capital. Temple gardens raked into silence, a thousand vermilion gates climbing Mount Inari, and kaiseki dinners served one small perfect plate at a time.',
        CURDATE() - INTERVAL 177 DAY,
        CURDATE() - INTERVAL 167 DAY,
        3450.00,
        'kyoto.jpg'
    ),
    (
        'Santorini, Greece',
        'White villages spilling down a volcanic cliff into water the colour of ink. Sunsets from Oia that people applaud, black sand beaches, and wine grown in baskets on the ground against the wind.',
        CURDATE() - INTERVAL 108 DAY,
        CURDATE() - INTERVAL 101 DAY,
        2240.00,
        'santorini.jpg'
    ),
    (
        'Barcelona, Spain',
        'Gaudi at every turn, a beach fifteen minutes from the Gothic Quarter, and a food market that has been feeding the city since 1217. Late dinners, later nights, and no one in a hurry.',
        CURDATE() - INTERVAL 5 DAY,
        CURDATE() + INTERVAL 7 DAY,
        1670.00,
        'barcelona.jpg'
    ),
    (
        'Prague, Czech Republic',
        'A city that came through the last century almost untouched. Baroque facades in a hundred colours, an astronomical clock that has kept time since 1410, and the best beer in Europe at half the price.',
        CURDATE() - INTERVAL 3 DAY,
        CURDATE() + INTERVAL 8 DAY,
        1320.00,
        'prague.jpg'
    ),
    (
        'Amalfi Coast, Italy',
        'Thirteen villages stacked on a cliff above the Tyrrhenian Sea. Lemon groves in terraces, a coastal road with a view at every bend, and boats to Capri leaving all morning.',
        CURDATE() - INTERVAL 1 DAY,
        CURDATE() + INTERVAL 11 DAY,
        2980.00,
        'amalfi.jpg'
    ),
    (
        'Reykjavik, Iceland',
        'Base camp for the Golden Circle. Geysers on a schedule, waterfalls you can walk behind, black beaches, and if the sky is clear and the sun is quiet enough, the aurora overhead.',
        CURDATE() + INTERVAL 24 DAY,
        CURDATE() + INTERVAL 32 DAY,
        3780.00,
        'reykjavik.jpg'
    ),
    (
        'Marrakesh, Morocco',
        'The souks of the medina, a square that turns into an open air kitchen at dusk, and a riad with a courtyard fountain to disappear into when it all gets loud. The Atlas Mountains are an hour away.',
        CURDATE() + INTERVAL 40 DAY,
        CURDATE() + INTERVAL 48 DAY,
        1450.00,
        'marrakesh.jpg'
    ),
    (
        'Lapland, Finland',
        'Above the Arctic Circle in deep winter. Husky sleds across frozen lakes, reindeer herders who still work the old way, a glass roofed cabin for the northern lights, and three hours of blue daylight.',
        CURDATE() + INTERVAL 83 DAY,
        CURDATE() + INTERVAL 92 DAY,
        4320.00,
        'lapland.jpg'
    ),
    (
        'Patagonia, Argentina',
        'The end of the continent. Granite towers over glacial lakes, the Perito Moreno glacier calving into the water while you watch, and hiking trails where you will not see another person for hours.',
        CURDATE() + INTERVAL 105 DAY,
        CURDATE() + INTERVAL 118 DAY,
        5650.00,
        'patagonia.jpg'
    ),
    (
        'Dubrovnik, Croatia',
        'A walled city on the Adriatic, entirely limestone and entirely walkable. Circle the ramparts at golden hour, swim off the rocks below the old town, and take the cable car up for the whole coast at once.',
        CURDATE() + INTERVAL 189 DAY,
        CURDATE() + INTERVAL 197 DAY,
        1780.00,
        'dubrovnik.jpg'
    ),
    (
        'Bali, Indonesia',
        'Rice terraces in Ubud, surf breaks on the west coast, and temples on cliffs above the sea. Mornings at a warung, afternoons in the water, and a volcano sunrise hike if you can face the alarm.',
        CURDATE() + INTERVAL 232 DAY,
        CURDATE() + INTERVAL 244 DAY,
        3190.00,
        'bali.jpg'
    );

-- The admin and the demo users all use the password 1234.
INSERT INTO
    users (
        firstName,
        lastName,
        email,
        password,
        role
    )
VALUES (
        'Itay',
        'Goldenberg',
        'admin@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'Admin'
    ),
    (
        'Noa',
        'Levi',
        'noa@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'User'
    ),
    (
        'Daniel',
        'Cohen',
        'daniel@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'User'
    ),
    (
        'Maya',
        'Friedman',
        'maya@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'User'
    ),
    (
        'Omer',
        'Shapiro',
        'omer@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'User'
    ),
    (
        'Yael',
        'Ben-David',
        'yael@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'User'
    ),
    (
        'Amit',
        'Katz',
        'amit@wayfare.com',
        '9bba6ba2bf44f519164e7bf84f8178998a2e863ed8ed9101325fdf06a3a30cb6d569a7942d9846d433ed8561c1083f2fb05ba25f9f318e063808cd1b64592afc',
        'User'
    );

INSERT INTO
    likes (userId, vacationId)
VALUES (2, 3),
    (2, 6),
    (2, 9),
    (2, 12),
    (3, 2),
    (3, 3),
    (3, 7),
    (3, 12),
    (4, 3),
    (4, 5),
    (4, 9),
    (4, 10),
    (5, 2),
    (5, 3),
    (5, 6),
    (5, 11),
    (5, 12),
    (6, 1),
    (6, 3),
    (6, 9),
    (6, 12),
    (7, 2),
    (7, 6),
    (7, 8);
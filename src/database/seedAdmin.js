const config = require('../config/env.config');
const { User } = require('./associations');


const seedAdmin = async () => {
  const { email, password, name } = config.admin;

  if (!email || !password) {
    console.warn(
      '️  [Seed] ADMIN_EMAIL y ADMIN_PASSWORD no están definidos en el .env. Se omite la creación del admin.'
    );
    return;
  }

  const existingAdmin = await User.findOne({ where: { role: 'ADMIN' } });

  if (existingAdmin) {
    console.log(` [Seed] Usuario admin ya existe: ${existingAdmin.email}`);
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: 'ADMIN',
  });

  console.log(` [Seed] Usuario admin creado exitosamente: ${email}`);
};

module.exports = { seedAdmin };

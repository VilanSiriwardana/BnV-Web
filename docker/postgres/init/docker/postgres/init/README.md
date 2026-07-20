# PostgreSQL Initialization Scripts

This directory contains SQL scripts that are executed automatically only when PostgreSQL initializes a brand-new data volume.

Examples:

- Create extensions
- Seed lookup tables
- Insert default roles
- Insert default permissions

Scripts execute in alphabetical order.

Example:

001_extensions.sql
002_seed_roles.sql
003_seed_permissions.sql

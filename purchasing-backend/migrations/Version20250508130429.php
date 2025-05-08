<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250508130429 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE "order" (id SERIAL NOT NULL, customer_id INT NOT NULL, order_number VARCHAR(50) NOT NULL, order_date DATE NOT NULL, status VARCHAR(50) NOT NULL, total_amount NUMERIC(10, 2) NOT NULL, notes TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, is_active BOOLEAN NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_F5299398551F0F81 ON "order" (order_number)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_F52993989395C3F3 ON "order" (customer_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "order".order_date IS '(DC2Type:date_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "order".created_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "order".updated_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN "order".deleted_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE product_order (id SERIAL NOT NULL, purchase_order_id INT NOT NULL, product_id INT NOT NULL, quantity INT NOT NULL, unit_price NUMERIC(10, 2) NOT NULL, total_price NUMERIC(10, 2) NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_5475E8C4A45D7E6A ON product_order (purchase_order_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_5475E8C44584665A ON product_order (product_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "order" ADD CONSTRAINT FK_F52993989395C3F3 FOREIGN KEY (customer_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE product_order ADD CONSTRAINT FK_5475E8C4A45D7E6A FOREIGN KEY (purchase_order_id) REFERENCES "order" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE product_order ADD CONSTRAINT FK_5475E8C44584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE product ALTER category_id SET NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "order" DROP CONSTRAINT FK_F52993989395C3F3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE product_order DROP CONSTRAINT FK_5475E8C4A45D7E6A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE product_order DROP CONSTRAINT FK_5475E8C44584665A
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE "order"
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE product_order
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE product ALTER category_id DROP NOT NULL
        SQL);
    }
}

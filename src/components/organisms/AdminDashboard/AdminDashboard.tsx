"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { uploadProductImages } from "@/lib/upload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import {
  addProduct,
  addSection,
  removeProduct,
  removeSection,
  resetCatalog,
} from "@/store/slices/catalogSlice";
import styles from "./AdminDashboard.module.scss";

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((s) => s.catalog.sections);
  const products = useAppSelector((s) => s.catalog.products);
  const email = useAppSelector((s) => s.auth.email);

  const [sectionName, setSectionName] = useState("");
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddSection = (e: FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) return;
    dispatch(addSection({ name: sectionName.trim() }));
    setSectionName("");
    setMessage("Seção adicionada!");
  };

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("images") as HTMLInputElement;
    const files = fileInput?.files;

    if (!sectionId || !title.trim() || !price) {
      setMessage("Preencha seção, título e preço.");
      return;
    }

    let images: string[] = [];
    if (files && files.length > 0) {
      setUploading(true);
      try {
        images = await uploadProductImages(files);
      } catch {
        setMessage("Erro ao enviar imagens.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (images.length === 0) {
      setMessage("Adicione pelo menos uma imagem.");
      return;
    }

    dispatch(
      addProduct({
        sectionId,
        title: title.trim(),
        description: description.trim(),
        price: Number.parseFloat(price.replace(",", ".")),
        images,
      }),
    );

    setTitle("");
    setDescription("");
    setPrice("");
    form.reset();
    setMessage("Produto cadastrado com sucesso!");
  };

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <div>
          <Link href="/" className={styles.back}>
            ← Voltar à loja
          </Link>
          <h1 className={styles.heading}>Painel — Rafa Store</h1>
          <p className={styles.user}>Logado como {email || "admin"}</p>
        </div>
        <Button variant="outline" onClick={() => dispatch(logout())}>
          Sair
        </Button>
      </header>

      {message && <p className={styles.feedback}>{message}</p>}

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Seções</h2>
          <form className={styles.row} onSubmit={handleAddSection}>
            <Input
              label="Nova seção"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Ex: Macacões"
            />
            <Button type="submit">Adicionar</Button>
          </form>
          <ul className={styles.list}>
            {sections.map((s) => (
              <li key={s.id} className={styles.listItem}>
                <span>{s.name}</span>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => dispatch(removeSection(s.id))}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <Button variant="ghost" onClick={() => dispatch(resetCatalog())}>
            Restaurar catálogo inicial
          </Button>
        </section>

        <section className={styles.card}>
          <h2>Novo produto</h2>
          <form className={styles.form} onSubmit={handleAddProduct}>
            <label className={styles.selectLabel}>
              Seção
              <select
                className={styles.select}
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label="Preço (R$)"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label className={styles.fileLabel}>
              Imagens
              <input type="file" name="images" accept="image/*" multiple className={styles.file} />
            </label>
            <Button type="submit" fullWidth disabled={uploading}>
              {uploading ? "Enviando..." : "Cadastrar produto"}
            </Button>
          </form>
        </section>

        <section className={styles.cardWide}>
          <h2>Produtos cadastrados ({products.length})</h2>
          <ul className={styles.productList}>
            {products.map((p) => {
              const section = sections.find((s) => s.id === p.sectionId);
              return (
                <li key={p.id} className={styles.productItem}>
                  {p.images[0] && <img src={p.images[0]} alt="" className={styles.thumb} />}
                  <div>
                    <strong>{p.title}</strong>
                    <p className={styles.meta}>
                      {section?.name} — R$ {p.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => dispatch(removeProduct(p.id))}
                  >
                    Excluir
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

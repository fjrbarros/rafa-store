"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Select } from "@/components/atoms/Select/Select";
import { ImageDropzone } from "@/components/molecules/ImageDropzone/ImageDropzone";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { getUploadUrlsToDelete } from "@/lib/productImages";
import { deleteProductImages, uploadProductImages } from "@/lib/upload";
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

  useEffect(() => {
    if (sections.length === 0) return;
    if (!sections.some((s) => s.id === sectionId)) {
      setSectionId(sections[0].id);
    }
  }, [sections, sectionId]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
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

    if (!sectionId || !title.trim() || !price) {
      setMessage("Preencha seção, título e preço.");
      return;
    }

    if (selectedImages.length === 0) {
      setMessage("Adicione pelo menos uma imagem.");
      return;
    }

    setUploading(true);
    let images: string[] = [];
    try {
      images = await uploadProductImages(selectedImages);
    } catch {
      setMessage("Erro ao enviar imagens.");
      setUploading(false);
      return;
    }
    setUploading(false);

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
    setSelectedImages([]);
    setMessage("Produto cadastrado com sucesso!");
  };

  const handleRemoveProduct = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const urls = getUploadUrlsToDelete(product.images, products, new Set([productId]));

    try {
      await deleteProductImages(urls);
    } catch {
      setMessage("Erro ao remover imagens do servidor.");
      return;
    }

    dispatch(removeProduct(productId));
    setMessage("Produto excluído.");
  };

  const handleRemoveSection = async (sectionIdToRemove: string) => {
    const sectionProducts = products.filter((p) => p.sectionId === sectionIdToRemove);
    const productIds = new Set(sectionProducts.map((p) => p.id));
    const urls = getUploadUrlsToDelete(
      sectionProducts.flatMap((p) => p.images),
      products,
      productIds,
    );

    try {
      await deleteProductImages(urls);
    } catch {
      setMessage("Erro ao remover imagens do servidor.");
      return;
    }

    dispatch(removeSection(sectionIdToRemove));
    setMessage("Seção removida.");
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
                  onClick={() => handleRemoveSection(s.id)}
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
            <Select
              label="Seção"
              name="section"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={sections.length === 0}
              placeholder="Cadastre uma seção primeiro"
              options={sections.map((s) => ({ value: s.id, label: s.name }))}
            />
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
            <ImageDropzone
              files={selectedImages}
              onChange={setSelectedImages}
              disabled={uploading}
            />
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
                    onClick={() => handleRemoveProduct(p.id)}
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


import { useEffect, useState } from "react";
import api from "../../services/api";

function ReviewsSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const isLoggedIn = Boolean(
        localStorage.getItem("token")
    );

    const loadReviews = async () => {
        try {
            setError("");

            const response = await api.get("/reviews");

            setReviews(response.data.data || []);
        } catch (err) {
            console.error("Error al cargar reseñas:", err);

            setError(
                "No fue posible cargar las reseñas. Inténtalo de nuevo."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!isLoggedIn) {
            setError(
                "Debes iniciar sesión para publicar una reseña."
            );
            return;
        }

        if (comment.trim().length < 5) {
            setError(
                "Escribe un comentario de al menos 5 caracteres."
            );
            return;
        }

        if (comment.trim().length > 1000) {
            setError(
                "El comentario no puede superar los 1000 caracteres."
            );
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/reviews", {
                rating,
                comment: comment.trim(),
            });

            setComment("");
            setRating(5);
            setMessage("¡Tu reseña se publicó correctamente!");

            await loadReviews();
        } catch (err) {
            console.error("Error al publicar reseña:", err);

            setError(
                err.response?.data?.message ||
                "No se pudo publicar la reseña. Comprueba tu sesión e inténtalo de nuevo."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section
            id="reviews"
            className="bg-[#0b0b0b] py-20 text-white md:py-28"
        >
            <div className="mx-auto max-w-7xl px-5 md:px-10">

                {/* Encabezado */}
                <div className="mb-12 text-center">
                    <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#c6a15b]">
                        Experiencias reales
                    </p>

                    <h2 className="text-3xl font-bold md:text-5xl">
                        Lo que dicen nuestros clientes
                    </h2>

                    <div className="mx-auto mt-5 h-1 w-20 bg-[#c6a15b]" />

                    <p className="mx-auto mt-5 max-w-2xl text-gray-400">
                        Cada visita cuenta. Descubre las opiniones
                        de quienes han confiado en Aura Barber Studio.
                    </p>
                </div>

                {/* Tarjetas desplazables */}
                {loading ? (
                    <p className="py-10 text-center text-gray-400">
                        Cargando reseñas...
                    </p>
                ) : error && reviews.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-red-400">{error}</p>

                        <button
                            onClick={loadReviews}
                            className="mt-4 rounded border border-[#c6a15b] px-5 py-2 text-[#c6a15b] hover:bg-[#c6a15b] hover:text-black"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                        <p className="text-xl font-semibold">
                            Sé el primero en compartir tu experiencia
                        </p>

                        <p className="mt-3 text-gray-400">
                            Cuando nuestros clientes publiquen sus
                            opiniones, aparecerán aquí.
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6">
                            {reviews.map((review) => (
                                <article
                                    key={review.id}
                                    className="w-[290px] shrink-0 snap-start rounded-xl border border-white/10 bg-[#141414] p-6 transition-colors hover:border-[#c6a15b]/60 sm:w-[340px]"
                                >
                                    <div className="mb-4 flex gap-1 text-xl text-[#c6a15b]">
                                        {Array.from(
                                            { length: 5 },
                                            (_, index) => (
                                                <span key={index}>
                                                    {index < Number(review.rating)
                                                        ? "★"
                                                        : "☆"}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <p className="min-h-24 whitespace-pre-wrap break-words leading-relaxed text-gray-300">
                                        “{review.comment}”
                                    </p>

                                    <div className="mt-6 border-t border-white/10 pt-4">
                                        <p className="font-semibold text-white">
                                            {review.first_name}{" "}
                                            {review.last_name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {review.created_at
                                                ? new Date(
                                                    review.created_at
                                                ).toLocaleDateString("es-CR")
                                                : ""}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <p className="mt-2 text-center text-xs text-gray-500">
                            Desliza horizontalmente para ver más reseñas
                        </p>
                    </div>
                )}

                {/* Formulario */}
                <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-[#c6a15b]/30 bg-[#121212] p-6 md:p-8">
                    <h3 className="text-2xl font-bold">
                        Comparte tu experiencia
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        Tu opinión nos ayuda a seguir mejorando.
                    </p>

                    {!isLoggedIn ? (
                        <div className="mt-6">
                            <p className="text-gray-300">
                                Inicia sesión para dejar tu reseña.
                            </p>

                            <a
                                href="/login"
                                className="mt-4 inline-block rounded bg-[#c6a15b] px-6 py-3 font-semibold text-black transition hover:bg-[#dfbd79]"
                            >
                                Iniciar sesión
                            </a>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-5"
                        >
                            <div>
                                <label className="mb-3 block text-sm font-medium">
                                    Tu puntuación
                                </label>

                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            aria-label={`${star} estrellas`}
                                            aria-pressed={rating === star}
                                            className={`text-3xl transition ${
                                                star <= rating
                                                    ? "text-[#c6a15b]"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="review-comment"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Tu comentario
                                </label>

                                <textarea
                                    id="review-comment"
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(event.target.value)
                                    }
                                    maxLength={1000}
                                    minLength={5}
                                    required
                                    rows={4}
                                    placeholder="Cuéntanos cómo fue tu experiencia..."
                                    className="w-full resize-y rounded-lg border border-white/10 bg-black/40 p-4 text-white outline-none placeholder:text-gray-600 focus:border-[#c6a15b]"
                                />

                                <p className="mt-1 text-right text-xs text-gray-500">
                                    {comment.length}/1000
                                </p>
                            </div>

                            {message && (
                                <p
                                    role="status"
                                    className="text-sm text-green-400"
                                >
                                    {message}
                                </p>
                            )}

                            {error && (
                                <p
                                    role="alert"
                                    className="text-sm text-red-400"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-lg bg-[#c6a15b] px-6 py-3 font-bold text-black transition hover:bg-[#dfbd79] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting
                                    ? "Publicando..."
                                    : "Publicar reseña"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ReviewsSection;

// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { EyeOff, Eye, Calendar, TrendingUp, Target, Wallet, SlidersHorizontal, Plus, ChevronRight, Edit, Delete, X, ArrowLeftRight, Activity, Tag } from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { AccountIcon } from '../common/AccountIcon';
import { SwipeableTransactionItem } from '../transactions/SwipeableTransactionItem';
import { WalletManagementModal } from '../tools/WalletManagementModal';
import { QuickBudgetModal } from './QuickBudgetModal';
import { formatCurrency, toArabicNumerals, getLocalDateString, sumMoney, getCurrencySymbol, getTodayExpenses } from '../../utils/calculations';
import { formatDateLabel, getCategoryDisplayName, getAccountDisplayName, getAccountTypeDisplayName } from '../../utils/i18n';
import { triggerHaptic } from '../../utils/haptics';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useBackHandler } from '../../hooks/useBackHandler';


export const HomeScreen = () => {
	const { expenses, categories, accounts, accountSummaries, budget, budgetPace, updateBudgetAmount, referenceDate, settings, openAddExpense, setViewingExpense, setEditingExpense, removeExpense, duplicateExpense, setActiveTab, setFilters, isPrivacyMode, togglePrivacyMode, language, numberFormat, t } = useApp();
	const formatNum = (val) => {
		return language === "ar" ? toArabicNumerals(val) : String(val);
	};
	const [heroCardMode, setHeroCardMode] = useState("today");
	const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
	const [selectedWalletId, setSelectedWalletId] = useState(null);
	const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
	useBodyScrollLock(isWalletModalOpen || Boolean(selectedWalletId));
	useBackHandler(Boolean(selectedWalletId), () => setSelectedWalletId(null), "quick-wallet-sheet");
	const selectedWalletSummary = useMemo(() => {
		if (!selectedWalletId) return null;
		return accountSummaries.summaries.find((s) => s.account.id === selectedWalletId) || null;
	}, [selectedWalletId, accountSummaries]);
	const selectedWalletExpenses = useMemo(() => {
		if (!selectedWalletId) return [];
		return expenses.filter((e) => !e.isDeleted && (e.accountId === selectedWalletId || e.paymentMethodId === selectedWalletId || e.fromAccountId === selectedWalletId || e.toAccountId === selectedWalletId)).slice(0, 4);
	}, [selectedWalletId, expenses]);
	const isWalletsSectionVisible = settings.showWalletsOnHome !== false;
	const visibleHomeWallets = useMemo(() => {
		if (!isWalletsSectionVisible) return [];
		return accountSummaries.summaries.filter(
			(s) => s.account.isActive !== false && !s.account.isArchived && s.account.showOnHome !== false
		);
	}, [accountSummaries, isWalletsSectionVisible]);
	const todayData = useMemo(() => {
		const todayStr = getLocalDateString(referenceDate);
		return getTodayExpenses(expenses, todayStr);
	}, [expenses, referenceDate]);
	const todayIncome = useMemo(() => {
		const todayStr = getLocalDateString(referenceDate);
		return sumMoney(expenses.filter((e) => !e.isDeleted && e.type === "income" && e.date === todayStr).map((e) => e.amount));
	}, [expenses, referenceDate]);
	const getTodayTransactionsCountLabel = (count) => {
		if (language === "ar") {
			if (count === 1) return "معاملة واحدة اليوم";
			if (count === 2) return "معاملتان اليوم";
			if (count >= 3 && count <= 10) return `${formatNum(count)} معاملات اليوم`;
			return `${formatNum(count)} معاملة اليوم`;
		}
		return count === 1 ? "1 transaction today" : `${formatNum(count)} transactions today`;
	};
	const recentTransactions = useMemo(() => {
		return [...expenses].filter((e) => !e.isDeleted).sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)).slice(0, 4);
	}, [expenses]);
	const categoryMap = useMemo(() => {
		return new Map(categories.map((c) => [c.id, c]));
	}, [categories]);
	const hasBudget = budgetPace.status !== "no_budget" && budgetPace.budget !== null && budgetPace.budget > 0;
	const todayStr = getLocalDateString(referenceDate);
	const availableAmount = hasBudget ? budgetPace.requiredRemainingDailyAverage || 0 : todayData.total;
	const rawFormattedAvailable = Math.round(availableAmount).toLocaleString("en-US");
	const formattedAvailableNumber = isPrivacyMode ? "••••" : language === "ar" ? toArabicNumerals(rawFormattedAvailable) : rawFormattedAvailable;
	const currencyAbbr = getCurrencySymbol(settings.currency, language);
	return /* @__PURE__ */ _jsxs("div", {
		className: "space-y-3.5 pb-6 text-slate-900 dark:text-slate-100",
		children: [
			/* @__PURE__ */ _jsxs("div", {
				className: "flex items-center justify-between pt-1",
				children: [/* @__PURE__ */ _jsx("div", { children: /* @__PURE__ */ _jsx("h1", {
					className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight",
					children: formatDateLabel(todayStr, language)
				}) }), /* @__PURE__ */ _jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ _jsx("button", {
						type: "button",
						onClick: togglePrivacyMode,
						title: isPrivacyMode ? language === "ar" ? "إظهار الأرقام" : "Show amounts" : language === "ar" ? "إخفاء الأرقام" : "Hide amounts",
						className: `p-2 rounded-full border transition-all cursor-pointer shadow-2xs ${isPrivacyMode ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`,
						children: isPrivacyMode ? /* @__PURE__ */ _jsx(EyeOff, {
							size: 16,
							strokeWidth: 1.5
						}) : /* @__PURE__ */ _jsx(Eye, {
							size: 16,
							strokeWidth: 1.5
						})
					}), /* @__PURE__ */ _jsxs("div", {
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 font-semibold shadow-2xs",
						children: [/* @__PURE__ */ _jsx(Calendar, {
							size: 13,
							strokeWidth: 1.5,
							className: "text-blue-600 dark:text-blue-400"
						}), /* @__PURE__ */ _jsx("span", { children: hasBudget && budgetPace.daysRemaining > 0 ? language === "ar" ? `باقي ${formatNum(budgetPace.daysRemaining)} يوماً` : `${formatNum(budgetPace.daysRemaining)}d left` : language === "ar" ? `اليوم ${formatNum(budgetPace.daysElapsed)}` : `Day ${formatNum(budgetPace.daysElapsed)}` })]
					})]
				})]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#091124] via-[#0f1b38] to-[#16274e] text-white border border-blue-400/20 shadow-xs space-y-3.5 select-none",
				children: [
					/* @__PURE__ */ _jsx("div", { className: "absolute -top-16 -right-16 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" }),
					/* @__PURE__ */ _jsx("div", { className: "absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" }),
					/* @__PURE__ */ _jsxs("div", {
						className: "relative flex items-center justify-between gap-1 pb-1",
						children: [/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center gap-1 bg-white/10 p-0.5 rounded-xl backdrop-blur-xs border border-white/10 text-[11px] font-bold",
							children: [
								/* @__PURE__ */ _jsx("button", {
									type: "button",
									onClick: () => {
										triggerHaptic("light");
										setHeroCardMode("today");
									},
									className: `px-2.5 py-1 rounded-lg transition-all cursor-pointer ${heroCardMode === "today" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"}`,
									children: language === "ar" ? "اليوم" : "Today"
								}),
								/* @__PURE__ */ _jsx("button", {
									type: "button",
									onClick: () => {
										triggerHaptic("light");
										setHeroCardMode("budget");
									},
									className: `px-2.5 py-1 rounded-lg transition-all cursor-pointer ${heroCardMode === "budget" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"}`,
									children: language === "ar" ? "الميزانية" : "Budget"
								}),
								/* @__PURE__ */ _jsx("button", {
									type: "button",
									onClick: () => {
										triggerHaptic("light");
										setHeroCardMode("netWorth");
									},
									className: `px-2.5 py-1 rounded-lg transition-all cursor-pointer ${heroCardMode === "netWorth" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"}`,
									children: language === "ar" ? "صافي الرصيد" : "Net Worth"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ _jsxs("div", {
					className: "relative flex items-center justify-between gap-3 min-w-0",
					children: [
						/* Balance on start (right in RTL) */
						/* @__PURE__ */ _jsxs("div", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-normal text-white drop-shadow-xs truncate min-w-0 font-budget-digits",
							children: [
								heroCardMode === "today" && formatCurrency(todayData.total, settings.currency, language, isPrivacyMode, numberFormat),
								heroCardMode === "budget" && formatCurrency(budgetPace.remaining || 0, settings.currency, language, isPrivacyMode, numberFormat),
								heroCardMode === "netWorth" && formatCurrency(accountSummaries.totalNetWorth, settings.currency, language, isPrivacyMode, numberFormat)
							]
						}),
						/* Left side in RTL (end): transaction count & indicators */
						/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [
								heroCardMode === "today" && todayIncome > 0 && /* @__PURE__ */ _jsxs("div", {
									className: "flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0 font-budget-digits",
									children: [/* @__PURE__ */ _jsx(TrendingUp, {
										size: 12,
										strokeWidth: 1.5
									}), /* @__PURE__ */ _jsxs("span", { children: ["+", formatCurrency(todayIncome, settings.currency, language, isPrivacyMode, numberFormat)] })]
								}),
								heroCardMode === "today" && todayData.count > 0 && /* @__PURE__ */ _jsx("span", {
									className: "text-[10px] sm:text-[11px] font-semibold text-blue-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-xs shrink-0 whitespace-nowrap",
									children: getTodayTransactionsCountLabel(todayData.count)
								}),
								heroCardMode === "budget" && hasBudget && budgetPace.percentUsed !== null && /* @__PURE__ */ _jsx("div", {
									className: `flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 font-budget-digits ${budgetPace.status === "over_budget" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`,
									children: /* @__PURE__ */ _jsxs("span", { children: [formatNum(budgetPace.percentUsed), "%"] })
								})
							]
						})
					]
				}),
					hasBudget && budgetPace.percentUsed !== null ? /* @__PURE__ */ _jsxs("div", {
						className: "relative pt-2.5 border-t border-white/10 space-y-2",
						children: [
							/* @__PURE__ */ _jsxs("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "text-slate-300 font-medium",
									children: language === "ar" ? "المتبقي من الميزانية:" : t.home.remaining
								}), /* @__PURE__ */ _jsxs("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ _jsx("span", {
										className: "font-bold text-white text-sm font-budget-digits",
										children: formatCurrency(budgetPace.remaining || 0, settings.currency, language, isPrivacyMode, numberFormat)
									}), /* @__PURE__ */ _jsxs("button", {
										type: "button",
										onClick: () => setIsBudgetModalOpen(true),
										className: "text-[10px] text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold hover:bg-amber-400/25 transition-colors cursor-pointer font-budget-digits",
										children: [formatNum(budgetPace.percentUsed ?? 0), "%"]
									})]
								})]
							}),
							/* @__PURE__ */ _jsx("div", {
								className: "w-full bg-white/15 rounded-full h-1.5 overflow-hidden",
								children: /* @__PURE__ */ _jsx("div", {
									style: { width: `${Math.min(100, Math.max(0, budgetPace.percentUsed))}%` },
									className: `h-full rounded-full transition-all duration-500 ${budgetPace.status === "over_budget" ? "bg-rose-500" : budgetPace.status === "watch" || budgetPace.status === "attention" ? "bg-amber-400" : "bg-emerald-400"}`
								})
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "flex items-center justify-between text-[11px] text-slate-300 pt-0.5",
								children: [/* @__PURE__ */ _jsx("span", { children: budgetPace.daysRemaining > 1 ? language === "ar" ? `باقي ${formatNum(budgetPace.daysRemaining)} يوماً` : `${formatNum(budgetPace.daysRemaining)} days left` : language === "ar" ? "اليوم الأخير" : "Final day" }), /* @__PURE__ */ _jsxs("span", { children: [language === "ar" ? "المتاح اليوم: " : "Daily allowance: ", /* @__PURE__ */ _jsxs("strong", {
									className: "text-amber-300 font-bold font-budget-digits",
									children: [formattedAvailableNumber, currencyAbbr ? ` ${currencyAbbr}` : ""]
								})] })]
							})
						]
					}) : /* @__PURE__ */ _jsxs("div", {
						className: "relative pt-2.5 border-t border-white/10 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ _jsx("span", {
							className: "text-slate-300 text-xs font-medium",
							children: language === "ar" ? "لم يتم تحديد ميزانية للشهر" : "No monthly budget set"
						}), /* @__PURE__ */ _jsxs("button", {
							type: "button",
							onClick: () => setIsBudgetModalOpen(true),
							className: "px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0",
							children: [/* @__PURE__ */ _jsx(Target, {
								size: 13,
								strokeWidth: 1.5,
								className: "text-amber-300"
							}), /* @__PURE__ */ _jsx("span", { children: language === "ar" ? "تحديد الميزانية" : "Set Budget" })]
						})]
					})
				]
			}),
			isWalletsSectionVisible && visibleHomeWallets.length > 0 && /* @__PURE__ */ _jsxs("div", {
				className: "bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-2.5",
				children: [
					/* @__PURE__ */ _jsxs("div", {
						className: "flex items-center justify-between",
						children: [
							/* @__PURE__ */ _jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ _jsx("div", {
										className: "w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center",
										children: /* @__PURE__ */ _jsx(Wallet, {
											size: 15,
											strokeWidth: 1.5
										})
									}),
									/* @__PURE__ */ _jsx("h2", {
										className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100",
										children: language === "ar" ? "المحافظ والحسابات" : "Wallets & Accounts"
									})
								]
							}),
							/* @__PURE__ */ _jsxs("button", {
								type: "button",
								onClick: () => setIsWalletModalOpen(true),
								className: "text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer py-1 px-1.5 transition-colors",
								children: [
									/* @__PURE__ */ _jsx(SlidersHorizontal, {
										size: 13,
										strokeWidth: 1.5
									}),
									/* @__PURE__ */ _jsx("span", {
										children: language === "ar" ? "إدارة" : "Manage"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ _jsx("div", {
						className: "flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5",
						children: visibleHomeWallets.map((s) => {
							const isOwed = s.currentBalance < 0;
							const accColor = s.account.color || "#3B82F6";
							return /* @__PURE__ */ _jsxs("button", {
								type: "button",
								onClick: () => setSelectedWalletId(s.account.id),
								className: "shrink-0 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-750 flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95",
								children: [
									/* @__PURE__ */ _jsx(AccountIcon, {
										name: s.account.icon || s.account.type,
										color: accColor,
										size: 14,
										strokeWidth: 1.5
									}),
									/* @__PURE__ */ _jsx("span", {
										className: "text-xs font-medium text-slate-700 dark:text-slate-300",
										children: getAccountDisplayName(s.account.name, language)
									}),
									/* @__PURE__ */ _jsx("span", {
										className: `text-xs font-bold ${isOwed ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`,
										children: formatCurrency(s.currentBalance, settings.currency, language, isPrivacyMode, numberFormat)
									})
								]
							}, s.account.id);
						})
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-3",
				children: [/* @__PURE__ */ _jsxs("div", {
					className: "flex items-center justify-between px-0.5",
					children: [/* @__PURE__ */ _jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsx("div", {
							className: "w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shadow-2xs",
							children: /* @__PURE__ */ _jsx(Calendar, {
								size: 15,
								strokeWidth: 1.5
							})
						}), /* @__PURE__ */ _jsx("h2", {
							className: "text-sm font-bold text-slate-900 dark:text-slate-100",
							children: t.home.recentTransactions
						})]
					}), /* @__PURE__ */ _jsxs("button", {
						type: "button",
						onClick: () => setActiveTab("transactions"),
						className: "text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer py-1 px-1.5",
						children: [/* @__PURE__ */ _jsx("span", { children: t.home.viewAll }), /* @__PURE__ */ _jsx(ChevronRight, {
							size: 14,
							strokeWidth: 1.5,
							className: "rtl:rotate-180"
						})]
					})]
				}), recentTransactions.length === 0 ? /* @__PURE__ */ _jsxs("div", {
					className: "py-8 text-center space-y-2",
					children: [/* @__PURE__ */ _jsx("p", {
						className: "text-xs font-semibold text-slate-400 dark:text-slate-500",
						children: t.home.noTransactionsYet
					}), /* @__PURE__ */ _jsx("button", {
						type: "button",
						onClick: () => openAddExpense(),
						className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs active:scale-95",
						children: /* @__PURE__ */ _jsx("span", { children: t.nav.addExpense })
					})]
				}) : /* @__PURE__ */ _jsx("div", {
					className: "bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-2xs",
					children: recentTransactions.map((exp) => {
						const cat = categoryMap.get(exp.categoryId);
						const fromAcc = accounts.find((a) => a.id === (exp.fromAccountId || exp.accountId));
						const toAcc = accounts.find((a) => a.id === exp.toAccountId);
						return /* @__PURE__ */ _jsx(SwipeableTransactionItem, {
							expense: exp,
							category: cat,
							fromAccount: fromAcc,
							toAccount: toAcc,
							currency: settings.currency,
							language,
							numberFormat,
							isPrivacyMode,
							onClick: () => {
								setEditingExpense(exp);
								openAddExpense();
							},
							onEdit: () => {
								setEditingExpense(exp);
								openAddExpense();
							},
							onDelete: () => removeExpense(exp.id),
							onDuplicate: () => duplicateExpense(exp),
							transferLabel: t.home.transfer,
							editLabel: language === "ar" ? "تعديل" : "Edit",
							deleteLabel: language === "ar" ? "حذف" : "Delete",
							duplicateLabel: language === "ar" ? "تكرار" : "Duplicate"
						}, exp.id);
					})
				})]
			}),
			selectedWalletSummary && /* @__PURE__ */ _jsx("div", {
				className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in",
				onClick: () => setSelectedWalletId(null),
				children: /* @__PURE__ */ _jsxs("div", {
					className: "w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ _jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ _jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ _jsx(AccountIcon, {
									type: selectedWalletSummary.account.type,
									color: selectedWalletSummary.account.color,
									size: 20,
									showBackground: true,
									className: "p-2.5 rounded-xl shadow-xs"
								}), (() => {
									const accDisplayName = getAccountDisplayName(selectedWalletSummary.account.name, language);
									return /* @__PURE__ */ _jsx("div", {
										children: /* @__PURE__ */ _jsx("h3", {
											className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
											children: accDisplayName
										})
									});
								})()]
							}), /* @__PURE__ */ _jsx("button", {
								type: "button",
								onClick: () => setSelectedWalletId(null),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors",
								children: /* @__PURE__ */ _jsx(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ _jsx("div", {
							className: "p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between",
							style: {
								borderRightWidth: language === "ar" ? 4 : 1,
								borderLeftWidth: language === "ar" ? 1 : 4,
								borderColor: selectedWalletSummary.account.color || "#3B82F6"
							},
							children: /* @__PURE__ */ _jsxs("div", { children: [/* @__PURE__ */ _jsx("span", {
								className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 block",
								children: language === "ar" ? "الرصيد الحالي" : "Current Balance"
							}), /* @__PURE__ */ _jsx("span", {
								className: `text-2xl font-black tracking-tight ${selectedWalletSummary.currentBalance < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`,
								children: formatCurrency(selectedWalletSummary.currentBalance, settings.currency, language, isPrivacyMode, numberFormat)
							})] })
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ _jsxs("button", {
								type: "button",
								onClick: () => {
									const accId = selectedWalletSummary.account.id;
									setSelectedWalletId(null);
									openAddExpense({
										type: "transfer",
										fromAccountId: accId
									});
								},
								className: "py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer",
								children: [/* @__PURE__ */ _jsx(ArrowLeftRight, {
									size: 14,
									className: "rtl:rotate-180"
								}), /* @__PURE__ */ _jsx("span", { children: language === "ar" ? "تحويل أموال" : "Transfer" })]
							}), /* @__PURE__ */ _jsxs("button", {
								type: "button",
								onClick: () => {
									const accId = selectedWalletSummary.account.id;
									setSelectedWalletId(null);
									setFilters((prev) => ({
										...prev,
										paymentMethodIds: [accId]
									}));
									setActiveTab("transactions");
								},
								className: "py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer",
								children: [/* @__PURE__ */ _jsx("span", { children: language === "ar" ? "كل المعاملات" : "All Transactions" }), /* @__PURE__ */ _jsx(ChevronRight, {
									size: 14,
									className: "rtl:rotate-180"
								})]
							})]
						}),
						/* @__PURE__ */ _jsxs("div", {
							className: "space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ _jsxs("div", {
								className: "flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-0.5",
								children: [/* @__PURE__ */ _jsx("span", { children: language === "ar" ? "آخر العمليات" : "Recent Activity" }), /* @__PURE__ */ _jsxs("span", {
									className: "text-[10px] text-slate-400 font-normal",
									children: [
										"(",
										formatNum(selectedWalletExpenses.length),
										")"
									]
								})]
							}), selectedWalletExpenses.length === 0 ? /* @__PURE__ */ _jsx("div", {
								className: "py-4 text-center text-xs text-slate-400",
								children: language === "ar" ? "لا توجد معاملات بعد" : "No transactions yet"
							}) : /* @__PURE__ */ _jsx("div", {
								className: "space-y-1.5 max-h-48 overflow-y-auto no-scrollbar",
								children: selectedWalletExpenses.map((exp) => {
									const cat = categories.find((c) => c.id === exp.categoryId);
									const isExp = exp.type === "expense";
									const isTransfer = exp.type === "transfer";
									getLocalDateString(referenceDate);
									return /* @__PURE__ */ _jsxs("div", {
										onClick: () => {
											setSelectedWalletId(null);
											setEditingExpense(exp);
											openAddExpense();
										},
										className: "p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 flex items-center justify-between gap-2 cursor-pointer transition-colors",
										children: [/* @__PURE__ */ _jsxs("div", {
											className: "flex items-center gap-2 min-w-0 flex-1 pe-2",
											children: [/* @__PURE__ */ _jsx(CategoryIcon, {
												name: cat?.icon || "Tag",
												color: cat?.color || "#3B82F6",
												size: 14
											}), /* @__PURE__ */ _jsxs("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ _jsx("span", {
													className: "text-xs font-bold text-slate-800 dark:text-slate-200 truncate block leading-normal",
													title: exp.merchant || exp.note || getCategoryDisplayName(cat?.name || "Other", language),
													children: exp.merchant || exp.note || getCategoryDisplayName(cat?.name || "Other", language)
												}), /* @__PURE__ */ _jsx("span", {
													className: "text-[10px] text-slate-400 block leading-normal",
													children: formatDateLabel(exp.date, language)
												})]
											})]
										}), /* @__PURE__ */ _jsxs("span", {
											className: `text-xs font-black shrink-0 ${isExp ? "text-slate-800 dark:text-slate-200" : isTransfer ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"}`,
											children: [isTransfer ? "⇄ " : isExp ? "− " : "+ ", formatCurrency(exp.amount, settings.currency, language, isPrivacyMode, numberFormat)]
										})]
									}, exp.id);
								})
							})]
						})
					]
				})
			}),
			isWalletModalOpen && /* @__PURE__ */ _jsx(WalletManagementModal, {
				isOpen: isWalletModalOpen,
				onClose: () => setIsWalletModalOpen(false)
			}),
			isBudgetModalOpen && /* @__PURE__ */ _jsx(QuickBudgetModal, {
				isOpen: isBudgetModalOpen,
				onClose: () => setIsBudgetModalOpen(false),
				currentBudget: budget?.amount || 0,
				currencySymbol: currencyAbbr,
				onSave: async (newAmount) => {
					await updateBudgetAmount(newAmount);
				},
				language
			})
		]
	});
};

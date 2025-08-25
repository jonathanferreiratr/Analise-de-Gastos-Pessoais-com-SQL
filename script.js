// script.js
        // Variáveis globais para os gráficos
        let categoryChart, monthlyChart, paymentChart;
        
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar dados se não existirem
            initializeData();
            
            // Carregar e exibir dados
            loadAndRenderData();
            
            // Configurar event listeners
            document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
            document.getElementById('applyFilters').addEventListener('click', applyFilters);
            document.getElementById('resetDataBtn').addEventListener('click', resetData);
        });
        
        function initializeData() {
            if (!localStorage.getItem('expenses')) {
                // Dados iniciais de exemplo
                const initialExpenses = [
                    { id: 1, date: '2024-01-05', description: 'Supermercado', category: 'Alimentação', value: 350.00, payment: 'Cartão Crédito' },
                    { id: 2, date: '2024-01-10', description: 'Restaurante', category: 'Alimentação', value: 120.00, payment: 'Cartão Débito' },
                    { id: 3, date: '2024-01-15', description: 'Aluguel', category: 'Moradia', value: 1200.00, payment: 'Transferência' },
                    { id: 4, date: '2024-01-18', description: 'Uber', category: 'Transporte', value: 35.00, payment: 'Cartão Crédito' },
                    { id: 5, date: '2024-01-20', description: 'Academia', category: 'Saúde', value: 89.90, payment: 'Cartão Débito' },
                    { id: 6, date: '2024-02-03', description: 'Supermercado', category: 'Alimentação', value: 280.00, payment: 'Cartão Crédito' },
                    { id: 7, date: '2024-02-15', description: 'Aluguel', category: 'Moradia', value: 1200.00, payment: 'Transferência' },
                    { id: 8, date: '2024-02-20', description: 'Gasolina', category: 'Transporte', value: 180.00, payment: 'Cartão Crédito' },
                    { id: 9, date: '2024-03-02', description: 'Supermercado', category: 'Alimentação', value: 320.00, payment: 'Cartão Crédito' },
                    { id: 10, date: '2024-03-15', description: 'Aluguel', category: 'Moradia', value: 1200.00, payment: 'Transferência' },
                    { id: 11, date: '2024-03-28', description: 'Eletrônicos', category: 'Tecnologia', value: 899.00, payment: 'Cartão Crédito' }
                ];
                
                localStorage.setItem('expenses', JSON.stringify(initialExpenses));
                localStorage.setItem('nextId', '12');
            }
        }
        
        function loadAndRenderData() {
            const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            renderAllCharts(expenses);
            updateStats(expenses);
            renderTopExpenses(expenses);
        }
        
        function addExpense() {
            const date = document.getElementById('expenseDate').value;
            const description = document.getElementById('expenseDescription').value;
            const category = document.getElementById('expenseCategory').value;
            const value = parseFloat(document.getElementById('expenseValue').value);
            const payment = document.getElementById('expensePayment').value;
            
            // Validação simples
            if (!date || !description || !category || isNaN(value) || value <= 0 || !payment) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }
            
            // Obter próximo ID
            const nextId = parseInt(localStorage.getItem('nextId') || '1');
            
            // Criar nova despesa
            const newExpense = {
                id: nextId,
                date,
                description,
                category,
                value,
                payment
            };
            
            // Salvar no localStorage
            const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            expenses.push(newExpense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            localStorage.setItem('nextId', (nextId + 1).toString());
            
            // Limpar formulário
            document.getElementById('expenseDate').value = '';
            document.getElementById('expenseDescription').value = '';
            document.getElementById('expenseCategory').value = '';
            document.getElementById('expenseValue').value = '';
            document.getElementById('expensePayment').value = '';
            
            // Atualizar visualizações
            loadAndRenderData();
            
            alert('Despesa adicionada com sucesso!');
        }
        
        function applyFilters() {
            const monthFilter = document.getElementById('monthFilter').value;
            const categoryFilter = document.getElementById('categoryFilter').value;
            
            let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            
            // Aplicar filtros
            if (monthFilter !== 'all') {
                expenses = expenses.filter(expense => {
                    const expenseMonth = new Date(expense.date).getMonth();
                    return expenseMonth === parseInt(monthFilter);
                });
            }
            
            if (categoryFilter !== 'all') {
                expenses = expenses.filter(expense => expense.category === categoryFilter);
            }
            
            // Atualizar visualizações com dados filtrados
            renderAllCharts(expenses);
            updateStats(expenses);
            renderTopExpenses(expenses);
        }
        
        function resetData() {
            if (confirm('Tem certeza que deseja resetar todos os dados? Isso irá apagar todas as despesas cadastradas.')) {
                localStorage.removeItem('expenses');
                localStorage.removeItem('nextId');
                initializeData();
                loadAndRenderData();
            }
        }
        
        function renderAllCharts(expenses) {
            renderCategoryChart(expenses);
            renderMonthlyChart(expenses);
            renderPaymentChart(expenses);
        }
        
        function renderCategoryChart(expenses) {
            const ctx = document.getElementById('categoryChart').getContext('2d');
            
            // Agrupar despesas por categoria
            const categories = {};
            expenses.forEach(expense => {
                if (!categories[expense.category]) {
                    categories[expense.category] = 0;
                }
                categories[expense.category] += expense.value;
            });
            
            // Preparar dados para o gráfico
            const labels = Object.keys(categories);
            const data = Object.values(categories);
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8ac248', '#22bbd0'];
            
            // Destruir gráfico anterior se existir
            if (categoryChart) {
                categoryChart.destroy();
            }
            
            // Criar novo gráfico
            categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        }
                    }
                }
            });
        }
        
        function renderMonthlyChart(expenses) {
            const ctx = document.getElementById('monthlyChart').getContext('2d');
            
            // Agrupar despesas por mês
            const monthlyData = Array(12).fill(0);
            expenses.forEach(expense => {
                const month = new Date(expense.date).getMonth();
                monthlyData[month] += expense.value;
            });
            
            // Destruir gráfico anterior se existir
            if (monthlyChart) {
                monthlyChart.destroy();
            }
            
            // Criar novo gráfico
            monthlyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Gastos Mensais (R$)',
                        data: monthlyData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        function renderPaymentChart(expenses) {
            const ctx = document.getElementById('paymentChart').getContext('2d');
            
            // Agrupar despesas por método de pagamento
            const paymentMethods = {};
            expenses.forEach(expense => {
                if (!paymentMethods[expense.payment]) {
                    paymentMethods[expense.payment] = 0;
                }
                paymentMethods[expense.payment] += expense.value;
            });
            
            // Preparar dados para o gráfico
            const labels = Object.keys(paymentMethods);
            const data = Object.values(paymentMethods);
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
            
            // Destruir gráfico anterior se existir
            if (paymentChart) {
                paymentChart.destroy();
            }
            
            // Criar novo gráfico
            paymentChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });
        }
        
        function updateStats(expenses) {
            // Calcular totais
            const totalExpense = expenses.reduce((sum, expense) => sum + expense.value, 0);
            const totalTransactions = expenses.length;
            
            // Encontrar maior despesa
            let maxExpense = 0;
            let maxExpenseCategory = '';
            if (expenses.length > 0) {
                const max = expenses.reduce((prev, current) => (prev.value > current.value) ? prev : current);
                maxExpense = max.value;
                maxExpenseCategory = max.description;
            }
            
            // Calcular média mensal
            const monthlyData = Array(12).fill(0);
            expenses.forEach(expense => {
                const month = new Date(expense.date).getMonth();
                monthlyData[month] += expense.value;
            });
            
            const monthsWithData = monthlyData.filter(value => value > 0).length;
            const avgMonthly = monthsWithData > 0 ? monthlyData.reduce((sum, value) => sum + value, 0) / monthsWithData : 0;
            
            // Encontrar categoria principal
            const categories = {};
            expenses.forEach(expense => {
                if (!categories[expense.category]) {
                    categories[expense.category] = 0;
                }
                categories[expense.category] += expense.value;
            });
            
            let mainCategory = '';
            let mainCategoryValue = 0;
            if (Object.keys(categories).length > 0) {
                mainCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
                mainCategoryValue = categories[mainCategory];
            }
            
            // Atualizar a interface
            document.getElementById('totalExpense').textContent = `R$ ${totalExpense.toFixed(2)}`;
            document.getElementById('totalTransactions').textContent = `${totalTransactions} transações`;
            document.getElementById('maxExpense').textContent = `R$ ${maxExpense.toFixed(2)}`;
            document.getElementById('maxExpenseCategory').textContent = maxExpenseCategory;
            document.getElementById('avgMonthly').textContent = `R$ ${avgMonthly.toFixed(2)}`;
            document.getElementById('mainCategory').textContent = mainCategory;
            document.getElementById('mainCategoryValue').textContent = `R$ ${mainCategoryValue.toFixed(2)}`;
        }
        
        function renderTopExpenses(expenses) {
            const topExpensesContainer = document.getElementById('topExpenses');
            topExpensesContainer.innerHTML = '';
            
            if (expenses.length === 0) {
                topExpensesContainer.innerHTML = '<li class="category-item">Nenhuma despesa cadastrada</li>';
                return;
            }
            
            // Ordenar despesas por valor (decrescente)
            const sortedExpenses = [...expenses].sort((a, b) => b.value - a.value);
            
            // Pegar as top 5
            const top5 = sortedExpenses.slice(0, 5);
            
            // Cores para as categorias
            const categoryColors = {
                'Alimentação': '#FF6384',
                'Moradia': '#36A2EB',
                'Transporte': '#FFCE56',
                'Entretenimento': '#4BC0C0',
                'Saúde': '#9966FF',
                'Educação': '#FF9F40',
                'Tecnologia': '#8ac248',
                'Vestuário': '#22bbd0'
            };
            
            // Renderizar cada item
            top5.forEach((expense, index) => {
                const li = document.createElement('li');
                li.className = 'category-item' + (index === 0 ? ' highlight' : '');
                
                li.innerHTML = `
                    <div class="category-name">
                        <span class="category-color" style="background-color: ${categoryColors[expense.category] || '#999'}"></span>
                        ${expense.description}
                    </div>
                    <div class="category-value">R$ ${expense.value.toFixed(2)}</div>
                `;
                
                topExpensesContainer.appendChild(li);
            });
        }
    